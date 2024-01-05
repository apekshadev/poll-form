import React, { useCallback, useEffect, useState} from 'react';
import './style.css';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { selectSlides, selectCurrentSlide, selectUserSelections, setSlides, setCurrentSlide, setUserSelections} from '../../redux/carousel/carouselSlice';
import {submitSummaryData} from "../../redux/carousel/carouselThunks"

interface Option {
  name: string;
  icon: string;
}

interface Slide {
  question?: string;
  options?: Option[];
  summary?: boolean;
}

interface CarouselProps {
  initialSlides?: () => Promise<Slide[]>;
}

const Carousel: React.FC<CarouselProps> = ({ initialSlides }) => {
  const [state, setState]= useState<any>(null);
  const dispatch = useDispatch();
  const slides = useSelector(selectSlides);
  const currentSlide = useSelector(selectCurrentSlide);
  const userSelections = useSelector(selectUserSelections);

  const goToSlide = (index: number) => {
    dispatch(setCurrentSlide(index));
  };

  const handleOptionClick = (option: Option) => {
    dispatch(setUserSelections({ ...userSelections, [currentSlide]: option.name }));
  };


  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    dispatch(setCurrentSlide(nextIndex));
  };

  useEffect(() => {
    const fetchSlides = async () => {
      if (initialSlides) {
        const res = await initialSlides();
        dispatch(setSlides(res));
      }
    };
    fetchSlides();
  }, [initialSlides, dispatch]);

  useEffect(()=>{
  if(slides[currentSlide]?.summary){
    const formattedSelections = Object.entries(userSelections).map(([slideIndex, selectedOption]) => {
      const currentSlideIndex = parseInt(slideIndex, 10);
      const question = slides[currentSlideIndex]?.question || ' ';
      return { question, answer: selectedOption };
    });
    setState(formattedSelections);
  }
  
  },[slides[currentSlide]?.summary, userSelections, slides]);

  useEffect(()=>{
    dispatch(submitSummaryData(state) as any);
  },[state]);


  const renderSummaryContent = useCallback(() => {
    const isSummaryVisible = slides[currentSlide]?.summary;
    const showSummaryClass = isSummaryVisible ? 'show' : '';
    return (  
      <div className={`summary-content-container ${showSummaryClass}`}>
        <ul>
          {state && state.map(({ question, answer } :any, index :number) => (
            <li key={index} className="reveal">
              <strong>{question}:</strong> <span>{answer}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  ,[currentSlide])

  return (
    <div className="vertical-carousel">
      <div className="left-panel">
        <h2>{slides[currentSlide]?.question || 'Summary'}</h2>
        <div className="pagination">
          {slides.map((slide, index) => (
            <span
              key={index}
              onClick={() => goToSlide(index)}
              className={index === currentSlide ? 'active' : ''}
            ></span>
          ))}
        </div>
      </div>
      <div className="right-panel">
        <p>
          {slides[currentSlide]?.summary ? (
            renderSummaryContent()
          ) : (
            slides[currentSlide]?.options?.map((option, index) => (
              <Tooltip key={index} title={option.name} arrow>
                <span
                  className="option-icon"
                  onClick={() => { handleOptionClick(option); nextSlide(); }}
                >
                  {option.icon}
                </span>
              </Tooltip>
            ))
          )}
        </p>
      </div>
    </div>
  );
};

export default Carousel;
