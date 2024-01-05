import slides from '../mockSlides.json';
export const getSlides = (): Promise<typeof slides> => {
    return Promise.resolve(slides);
  };