import React,{Suspense} from 'react';
import LoaderPage from '../../../_pages/loader';

import '../../normal_paper_display/App.css';
import { ILibPaperQuestions } from '../../normal_paper_display/interface/ILibPaper';

const LazyQuestionComponent = React.lazy(() => import('./question_comp'));

const DiffNormalPaperDisplay: React.FC<{
  tree: ILibPaperQuestions
}> = ({ tree }) => {
  // we want to see this tree 
  console.log(tree);

  return (
      <Suspense fallback={<LoaderPage/>}>
        {tree && <LazyQuestionComponent paper={tree}/>}
      </Suspense>
  )
}

export default DiffNormalPaperDisplay;