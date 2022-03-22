import React,{useState, useEffect,Suspense} from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalZoeziTrackedState } from '../../contexts/GlobalContext';
import LoaderPage from '../../_pages/loader';

import './App.css';

import getLibraryPaper from './interface/fetchpaper'
import { ILibPaperQuestions } from './interface/ILibPaper';

// get the paper id from the params
const NormalPaperDisplay = () => {
  const { authToken } = useGlobalZoeziTrackedState();
  const params = useParams();
  const [data,setData] = useState<ILibPaperQuestions | null>(null);

  // we also need the student id ( i guess )
  useEffect(() => {
    getLibraryPaper(`/api/library/normal_paper/${params.studentId}/${params.paperId}`, authToken || "")
      .then(data => setData(data))
      .catch(error => setData(null))
  },[]);

  const LazyQuestionComponent = React.lazy(() => import('./components/question_comp'));


  return (
    <main>
      <div className="container">
          <Suspense fallback={<LoaderPage/>}>
            {data && <LazyQuestionComponent paper={data}/>}
          </Suspense>
      </div>
    </main>
  )
}

export default NormalPaperDisplay;