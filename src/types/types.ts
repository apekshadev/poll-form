export interface Option  {
    name: string;
    icon: string;
  }
  
  export interface Slide  {
    question?: string;
    options?: Option[];
    summary?: boolean;
  }
  export interface FormattedSelection{
    question: string;
    answer: string;
  }

