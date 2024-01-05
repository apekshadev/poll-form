import slides from '../mockSlides.json';
export const getSlides = (): Promise<typeof slides> => {
    console.log(slides);
    return Promise.resolve(slides);
  };