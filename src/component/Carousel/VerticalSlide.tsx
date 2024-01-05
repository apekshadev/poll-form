import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Tooltip from "@mui/material/Tooltip";

interface VerticalSlideProps {
    question: string;
    options: { name: string; icon: string }[];
    onOptionClick: (option: { name: string; icon: string }) => void;
    isVisible: number;
    currentSlide: number;
    height: number;
    isFinalStep: boolean;
}

const VerticalSlide: React.FC<VerticalSlideProps> = ({
    question,
    options,
    onOptionClick,
    isVisible,
    currentSlide,
    height,
    isFinalStep,
}) => {
    const { userSelections, slides, successMessage } = useSelector(
        (state: RootState) => state.carousel
    );


    const slideStyle: React.CSSProperties = {
        transform: `translateY(-${currentSlide}00%)`,
        transition: "transform 0.5s ease-in-out",
        minHeight: `${height}px`,
    };

    const formattedSelectedData = Object.entries(userSelections).map(
        ([slideIndex, selectedOption]) => {
            const currentSlideIndex = parseInt(slideIndex, 10);
            const question = slides[currentSlideIndex]?.question || " ";
            return { question, answer: selectedOption };
        }
    );
    
    return (
        <div className="vertical-slide" style={slideStyle}>
            {!isFinalStep ? (
                <>
                    <div className="left-panel">
                        <h2>{question}</h2>
                    </div>
                    <div className="right-panel">
                        <div
                            className={`options-container ${userSelections[isVisible] ? "disabled" : ""
                                }`}
                        >
                            {options.map((option, index) => {
                                return (
                                    <Tooltip key={index} title={option.name} arrow>

                                        <div
                                            key={index}
                                            className={`option ${userSelections[isVisible] === option.name
                                                    ? "disabled"
                                                    : ""
                                                }`}
                                            onClick={() => onOptionClick(option)}
                                        >
                                            <span className="option-icon">{option.icon}</span>
                                        </div>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="left-panel">
                        <h2>Summary</h2>
                    </div>
                    <div className="right-panel">
                        <div className={`summary-content-container`}>
                            <ul>
                                {formattedSelectedData?.map(({ question, answer }, index) => (
                                    <li key={index} className="reveal">
                                        <strong>{question}:</strong> <span>{answer}</span>
                                    </li>
                                ))}
                            </ul>
                            {successMessage ? (
                                <div className="success-box"><span className="success-message">{successMessage}</span></div>
                            ) : null}

                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default VerticalSlide;
