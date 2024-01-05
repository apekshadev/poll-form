import React, { useEffect, useRef } from 'react';
import './style.css';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { selectSlides, selectCurrentSlide, selectUserSelections, setSlides, setCurrentSlide, setUserSelections } from '../../redux/slices/carouselSlice';

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

  // const prevSlide = () => {
  //   const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
  //   dispatch(setCurrentSlide(prevIndex));
  // };

  useEffect(() => {
    const fetchSlides = async () => {
      if (initialSlides) {
        const res = await initialSlides();
        dispatch(setSlides(res));
      }
    };
    fetchSlides();
  }, [initialSlides, dispatch]);

  const renderSummaryContent = () => {
    const showSummaryClass = slides[currentSlide]?.summary ? 'show' : '';

    return (
      <div className={`summary-content-container ${showSummaryClass}`}>
        <ul>
          {Object.entries(userSelections).map(([slideIndex, selectedOption]) => (
            <li key={slideIndex} className="reveal">
              <strong>{slides[parseInt(slideIndex, 10)].question}:</strong> <span>{selectedOption}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };



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
