import React from 'react';
import { render as rtlRender, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { RootState } from '../redux/store';
import VerticalSlide from '../component/Carousel/VerticalSlide';
import { submitSummaryData } from '../redux/carousel/carouselThunks';

jest.mock('../redux/carousel/carouselThunks', () => ({
    ...jest.requireActual('../redux/carousel/carouselThunks'),
    submitSummaryData: jest.fn(),
}));

// Need mockstore to test redux functionality.
const createMockStore = (state: RootState): EnhancedStore<RootState> => {
    return configureStore({
        reducer: {
            carousel: () => state.carousel,
        },
    });
};

//Here create common wrapper to avoid write provider/ store for every test.
const wrapperProvider = (
    ui: React.ReactElement,
    {
        initialState = {
            carousel: {
                slides: [],
                currentSlide: 0,
                userSelections: {},
                successMessage: null,
            },
        },
        store = createMockStore(initialState),
        ...renderOptions
    } = {}
) => {
    const Wrapper: React.FC = ({ children }: any) => (
        <Provider store={store}>{children}</Provider>
    );

    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('VerticalSlide component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const optionsMock = [
        { name: "Option 1", icon: "Icon1" },
        { name: "Option 2", icon: "Icon2" },
    ];

    const defaultProps = {
        question: "Test Question",
        options: optionsMock,
        onOptionClick: jest.fn(),
        isVisible: 0,
        currentSlide: 0,
        height: 100,
        isFinalStep: false,
    };

    // Test 1: To check component render consistently with default props. here , not using RTL query.
    //toMatchInlineSnapshot -- use for screening the changes in component.
    it("renders with default props", () => {
        const { container } = wrapperProvider(<VerticalSlide {...defaultProps} />);
        expect(container).toMatchInlineSnapshot();
    });

    // Test 2: to check if options are rendered correctly
    it("renders options correctly", () => {
        const { getByLabelText } = wrapperProvider(<VerticalSlide {...defaultProps} />);

        // Check if each option is present in the rendered output
        optionsMock.forEach(({ name }) => {
            expect(getByLabelText(name)).toBeInTheDocument();
        });
    });

    // Test 3: This test ensures that the component renders the final step correctly.Here set isFinalStep to true in the props,
    it("renders final step correctly", () => {
        const finalStepProps = { ...defaultProps, isFinalStep: true };
        const { getByText } = wrapperProvider(<VerticalSlide {...finalStepProps} />);

        // getByText RTLQuery use for check "Summary" text is present in the rendered output
        expect(getByText("Summary")).toBeInTheDocument();

    });

    // Test 4: to Check if the onOptionClick callback is called with the correct option
    it("handles option click", () => {
        const { getByLabelText } = wrapperProvider(<VerticalSlide {...defaultProps} />);
        // here used getByLabelText RTLQuery to get by aria-label 
        fireEvent.click(getByLabelText("Option 1"));
        expect(defaultProps.onOptionClick).toHaveBeenCalledWith(optionsMock[0]);
    });

    // Test 5: To Check submits summary data on final step with expected data.
    // This test case is failed, as number of calls are showing 0 here.
    it('submits summary data on final step', async () => {
        const finalStepProps = { ...defaultProps, isFinalStep: true, };
        wrapperProvider(<VerticalSlide {...finalStepProps} />);
        await waitFor(() => {
            const expectedSelections = [
                { question: 'Question1', answer: 'Answer1' },
                { question: 'Question2', answer: 'Answer2' },
            ];
            expect(submitSummaryData).toHaveBeenCalledWith(expectedSelections);
        });
    });
});
