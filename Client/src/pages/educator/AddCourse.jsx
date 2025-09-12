import React, { useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid';
import Quill from 'quill';
import { assets } from '../../assets/assets';

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image , setImage] = useState(null);
  const [chapters , setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId , setCurrentChapterId] = useState(null);
  const [lectureDetails , setLectureDetails] = useState(
    {lectureTitle : "" , lectureDuration : "" , lectureUrl : "" , isPreviewFree : false}
  );

  // ✅ Add Lecture
  const addLecture = () => {
    setChapters(chapters.map((chapter) => {
      if(chapter.id === currentChapterId) {
        const newLecture = {
          ...lectureDetails ,
          lectureOrder : chapter.chapterContent.length > 0 
            ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 
            : 1,
          lectureId : uniqid()
        };
        return { ...chapter, chapterContent: [...chapter.chapterContent, newLecture] };
      }
      return chapter;
    }));
    setShowPopup(false);
    setLectureDetails(
      {lectureTitle : "" , lectureDuration : "" , lectureUrl : "" , isPreviewFree : false} 
    )
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log({courseTitle, coursePrice, discount, image, chapters});
  }

  // ✅ Init Quill
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  // ✅ Handle Chapters
  const handleChapter = (action , chapterId) => {
    if(action === "add"){
      const title = prompt("Enter Chapter Title");
      if(title) {
        const newChapter = {
          id : uniqid(),
          chapterTitle : title,
          chapterContent : [],
          collapsed : false ,
          chapterOrder : chapters.length > 0 ? chapters[chapters.length - 1].chapterOrder + 1 : 1
        }
        setChapters([...chapters , newChapter])
      }
    }
    else if(action === "remove") {
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
    }
    else if(action === 'toggle') {
      setChapters(chapters.map((chapter) => {
        if(chapter.id === chapterId) {
          return {...chapter , collapsed : !chapter.collapsed}
        }
        return chapter;
      }))
    }
  }

  // ✅ Handle Lectures
  const handleLecture = (action , chapterId , lectureIndex) => {
    if(action === 'add'){
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    }
    else if(action === 'remove') {
      setChapters(chapters.map((chapter) => {
        if(chapter.id === chapterId) {
          const newContent = [...chapter.chapterContent];
          newContent.splice(lectureIndex , 1);
          return { ...chapter, chapterContent: newContent };
        }
        return chapter;
      }))
    }
  }

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <form action="" onSubmit ={handleSubmit} className='flex flex-col gap-4 max-w-4xl w-full text-gray-600'>
        {/* Title */}
        <div className='flex flex-col gap-1'>
          <p>CourseTitle</p>
          <input onChange={e => setCourseTitle(e.target.value)} value={courseTitle} type="text" placeholder='Enter Course Title' className='md:py-2.5 py-2 px-3 border border-gray-500 placeholder:text-gray-400 outline-none rounded px-2 text-sm' required />
        </div>

        {/* Description */}
        <div className='flex flex-col gap-1'>
          <p> Course Description</p>
          <div ref={editorRef}> </div>
        </div> 

        {/* Price + Thumbnail */}
        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input onChange = {e => setCoursePrice(e.target.value)} value={coursePrice} type="number" placeholder='Enter Course Price' className='md:py-2.5 py-2 px-3 border border-gray-500 placeholder:text-gray-400 outline-none rounded px-2 ' required />
          </div>
          <div className='flex flex-col md:flex-row items-center gap-1'>
            <p>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className='flex items-center gap-3'>
              <img src= {assets.file_upload_icon} className='p-3 bg-blue-600 rounded' />
              <input onChange={e => setImage(e.target.files[0])} type="file" name="thumbnailImage" id="thumbnailImage" className='hidden' accept='image/*'/>
              {image && <img src={URL.createObjectURL(image)} alt="" className="w-20 h-20 object-cover"/>}
            </label>
          </div>
        </div> 

        {/* Discount */}
        <div className='flex flex-col gap-1'>
          <p>Discount %</p>
          <input onChange={e => setDiscount(e.target.value)} value={discount} type="number" min={0} max={100} placeholder='Enter Discount' className='md:py-2.5 py-2 px-3 border border-gray-500 placeholder:text-gray-400 outline-none rounded px-2 ' required />
        </div>

        {/* Chapters */}
        <div>
          {chapters.map((chapter , chapterIndex) => (
            <div key={chapter.id} className='bg-white rounded-lg border mb-4'>
              <div className='flex justify-between items-center p-4 border-b'>
                <div className='flex items-center'>
                  <img src={assets.dropdown_icon} onClick={() => handleChapter('toggle',chapter.id)} width={14} alt="" className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && "-rotate-90"}`} />
                  <span className='font-semibold'>{chapterIndex + 1}. {chapter.chapterTitle}</span>
                </div>
                <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                <img src={assets.cross_icon} alt="" className='cursor-pointer' onClick={() => handleChapter('remove',chapter.id)} />
              </div>
              {!chapter.collapsed &&(
                <div className='p-4'>
                  {chapter.chapterContent.map((lecture , lectureIndex) => (
                    <div key={lecture.lectureId} className='flex items-center justify-between mb-2'>
                      <span>{lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration}mins - <a href={lecture.lectureUrl} target='_blank' className='text-blue-600'>Link</a> - {lecture.isPreviewFree ? "Free" : "Paid"}</span>
                      <img src={assets.cross_icon} alt="" className='cursor-pointer' onClick={() => handleLecture('remove',chapter.id , lectureIndex)} />
                    </div>
                  ))}
                  <div className='inline-flex bg-gray-200 p-2  rounded mt-2 cursor-pointer' onClick={() => handleLecture('add',chapter.id)}> + Add Lecture</div>
                </div>
              )}
            </div>
          ))}
          <div className='flex justify-center cursor-pointer items-center bg-blue-100 p-2 rounded-lg' onClick={() => handleChapter('add')}>+ Add Chapter</div>

          {/* Popup */}
          {showPopup && (
            <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
              <div className='bg-white rounded relative w-full max-w-80 p-4 text-gray-700'>
                <h2 className='text-lg font-semibold mb-4'> Add Lecture</h2>
                <div className='mb-2'>
                  <p>Lecture Title</p>
                  <input type="text" placeholder='Enter Lecture Title' className='mt-1 block w-full py-1 px-2' value={lectureDetails.lectureTitle} onChange={e => setLectureDetails({...lectureDetails , lectureTitle : e.target.value})}/>
                </div>
                <div className='mb-2'>
                  <p>Duration (minutes) </p>
                  <input type="number" placeholder='Enter Lecture Duration' className='mt-1 block w-full py-1 px-2' value={lectureDetails.lectureDuration} onChange={e => setLectureDetails({...lectureDetails , lectureDuration : e.target.value})}/>
                </div>
                <div className='mb-2'>
                  <p>Lecture URL</p>
                  <input type="text" placeholder='Enter Lecture url' className='mt-1 block w-full py-1 px-2' value={lectureDetails.lectureUrl} onChange={e => setLectureDetails({...lectureDetails , lectureUrl : e.target.value})}/>
                </div>
                <div className='flex gap-2 my-4 items-center'>
                  <p>Is Preview Free?</p>
                  <input type="checkbox" checked={lectureDetails.isPreviewFree} onChange={e => setLectureDetails({...lectureDetails , isPreviewFree : e.target.checked})}/>
                </div>
                <button type='button' className=' w-full bg-blue-400 hover:bg-blue-700 transition text-white px-4 py-2 rounded' onClick={addLecture}>Add</button>
                <img onClick={() => setShowPopup(false)} src={assets.cross_icon} className='absolute top-4 right-4 w-4 cursor-pointer' alt="" />
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button type='submit' className='w-max bg-black hover:bg-gray-800 my-4 transition text-white px-8 py-2.5 rounded'>ADD</button>
      </form>
    </div>
  )
}

export default AddCourse
