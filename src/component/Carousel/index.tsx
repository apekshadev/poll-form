import React, { useCallback, useEffect, useRef, useState } from "react";
import "./style.css";

import { useDispatch, useSelector } from "react-redux";
import {
  selectSlides,
  selectCurrentSlide,
  selectUserSelections,
  setSlides,
  setUserSelections,
} from "../../redux/carousel/carouselSlice";
import { submitSummaryData } from "../../redux/carousel/carouselThunks";
import VerticalSlide from "./VerticalSlide";

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
  const userSelections = useSelector(selectUserSelections);
  const [formattedSelections, setFormattedSelections] = useState<
    { question: string; answer: string }[]
  >([]);

  const verticalCarouselRef = useRef<HTMLDivElement | null>(null);

  const [animatedSlides, setAnimatedSlides] = useState<JSX.Element[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const nextSlide = useCallback(() => {
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    setCurrentSlideIndex(nextIndex);
  }, [currentSlideIndex, slides.length]);

  const onOptionClick = useCallback(
    (option: Option) => {
      dispatch(
        setUserSelections({
          ...userSelections,
          [currentSlideIndex]: option.name,
        })
      );
      nextSlide();
    },
    [currentSlideIndex, dispatch, nextSlide, userSelections]
  );

  const moveToSlide = (index: number) => {
    setCurrentSlideIndex(index);
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

  useEffect(() => {
    if (slides.length > 0) {
      const height = verticalCarouselRef.current?.clientHeight || 0;
      const animatedSlides = slides.map((slide, index) => (
        <VerticalSlide
          key={index}
          question={slide.question || "Summary"}
          options={slide.options || []}
          onOptionClick={onOptionClick}
          isVisible={index}
          currentSlide={currentSlideIndex}
          height={height}
          isFinalStep={!!slides[currentSlideIndex]?.summary}
        />
      ));
      setAnimatedSlides(animatedSlides);
    }
  }, [slides, currentSlideIndex, onOptionClick]);

  useEffect(() => {
    if (slides[currentSlideIndex]?.summary) {
      const updatedFormattedSelections = Object.entries(userSelections).map(
        ([slideIndex, selectedOption]) => {
          const currentSlideIndex = parseInt(slideIndex, 10);
          const question = slides[currentSlideIndex]?.question || " ";
          return { question, answer: selectedOption };
        }
      );
      setFormattedSelections(updatedFormattedSelections);
    }
  }, [currentSlideIndex, slides, userSelections]);

  useEffect(() => {
    if (slides[currentSlideIndex]?.summary && formattedSelections.length > 0) {
      console.log(console.log('Calling API...'))
      dispatch(submitSummaryData(formattedSelections) as any);
    }
  }, [currentSlideIndex, slides, formattedSelections, dispatch]);

  return (
    <div className="vertical-carousel" ref={verticalCarouselRef}>
      {animatedSlides.length > 0 && animatedSlides}
      <div className="pagination">
        {slides.map((slide, index) => (
          <span
            key={index}
            onClick={() => moveToSlide(index)}
            className={index === currentSlideIndex ? "active" : ""}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
