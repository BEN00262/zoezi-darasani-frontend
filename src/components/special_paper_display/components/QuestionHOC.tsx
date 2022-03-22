import React,{useState, useEffect,Suspense, useContext, useMemo} from 'react';
import { Container } from 'react-materialize';

import '../App.css';
import { IQuestion } from '../rendering_engine/DataLoaderInterface';
import { GlobalContext } from '../contexts/global';
import { get_already_done_pages_questions_total } from '../grouper/grouper';

const LazyQuestionComponent = React.lazy(() => import('./question_comp'));

export default function QuestionHOC({ wasTimed }: { wasTimed: boolean }) {
  const {subject, currentPage, 
    // @ts-ignore
    updateNoQuesPerPage,
    questions, paperMap
  } = useContext(GlobalContext);

  const [data,setData] = useState<IQuestion[]>([]);
  const [alreadyDone, setAlreadyDone] = useState<number>(0);
  const [reRender, setRerender] = useState(-1);
  const isKiswahili =  useMemo(() => subject.split(" ")[0].toLowerCase() === "kiswahili", [subject])

  useEffect(() => {
    setAlreadyDone(get_already_done_pages_questions_total(questions,paperMap, currentPage));
    const current_page = paperMap.pages[currentPage];

    updateNoQuesPerPage(current_page.endIndex - current_page.startIndex); // compute the value every time
    setData(questions.slice(current_page.startIndex, current_page.endIndex));
    setRerender(Math.random());
    
    // console.log("The current page is changing");
    // console.log(current_page);
    // console.log(currentPage);

  }, [currentPage]);
  
  return (
        <>
          <Suspense fallback={
            <Container>
                {isKiswahili ? "Karatasi inatayarishwa ..." : "Preparing paper ..."}
            </Container>
          }>
            <LazyQuestionComponent 
              questions={data} 
              key={reRender}
              alreadyDone={alreadyDone} 
              isKiswahili={isKiswahili}
              wasTimed={wasTimed}
            />
          </Suspense>
      </>
  )
}