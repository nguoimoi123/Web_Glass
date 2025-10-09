export interface SizeInfo {
  name: string;
  frameWidth: string;
  lensWidth: string;
  bridgeWidth: string;
  templeLength: string;
  lensHeight: string;
  weight: string;
  faceShapes: string[];
}
export const sizeGuides: Record<string, SizeInfo> = {
  Round: {
    name: 'Round',
    frameWidth: '136mm - 142mm',
    lensWidth: '46mm - 50mm',
    bridgeWidth: '18mm - 22mm',
    templeLength: '140mm - 145mm',
    lensHeight: '42mm - 46mm',
    weight: '15g - 25g',
    faceShapes: ['Square', 'Rectangle', 'Diamond', 'Heart']
  },
  Square: {
    name: 'Square',
    frameWidth: '138mm - 144mm',
    lensWidth: '48mm - 52mm',
    bridgeWidth: '16mm - 20mm',
    templeLength: '140mm - 145mm',
    lensHeight: '44mm - 48mm',
    weight: '18g - 28g',
    faceShapes: ['Round', 'Oval', 'Heart']
  },
  'Cat Eye': {
    name: 'Cat Eye',
    frameWidth: '134mm - 140mm',
    lensWidth: '45mm - 49mm',
    bridgeWidth: '16mm - 20mm',
    templeLength: '135mm - 140mm',
    lensHeight: '38mm - 44mm',
    weight: '16g - 24g',
    faceShapes: ['Round', 'Oval', 'Square', 'Diamond']
  },
  Aviator: {
    name: 'Aviator',
    frameWidth: '140mm - 146mm',
    lensWidth: '50mm - 54mm',
    bridgeWidth: '14mm - 18mm',
    templeLength: '140mm - 150mm',
    lensHeight: '45mm - 50mm',
    weight: '14g - 22g',
    faceShapes: ['Heart', 'Oval', 'Square', 'Triangle']
  },
  Rectangle: {
    name: 'Rectangle',
    frameWidth: '138mm - 144mm',
    lensWidth: '50mm - 54mm',
    bridgeWidth: '16mm - 20mm',
    templeLength: '140mm - 145mm',
    lensHeight: '36mm - 40mm',
    weight: '18g - 26g',
    faceShapes: ['Round', 'Oval', 'Heart']
  },
  Oversized: {
    name: 'Oversized',
    frameWidth: '144mm - 150mm',
    lensWidth: '54mm - 58mm',
    bridgeWidth: '18mm - 22mm',
    templeLength: '145mm - 150mm',
    lensHeight: '48mm - 54mm',
    weight: '20g - 30g',
    faceShapes: ['Heart', 'Oval', 'Diamond']
  },
  Rimless: {
    name: 'Rimless',
    frameWidth: '134mm - 140mm',
    lensWidth: '48mm - 52mm',
    bridgeWidth: '16mm - 20mm',
    templeLength: '135mm - 140mm',
    lensHeight: '38mm - 42mm',
    weight: '10g - 18g',
    faceShapes: ['All face shapes']
  },
  Geometric: {
    name: 'Geometric',
    frameWidth: '136mm - 142mm',
    lensWidth: '48mm - 52mm',
    bridgeWidth: '18mm - 22mm',
    templeLength: '140mm - 145mm',
    lensHeight: '44mm - 48mm',
    weight: '16g - 26g',
    faceShapes: ['Oval', 'Heart', 'Round']
  }
};
export const getSizeGuideByCategory = (category: string | undefined): SizeInfo | null => {
  if (!category) return null;
  return sizeGuides[category] || null;
};
export const getFaceShapeGuide = () => {
  return {
    Oval: ['Almost any frame style works well', 'Balance proportions with geometric frames', 'Try square, rectangular, or cat-eye frames'],
    Round: ['Angular frames to add definition', 'Rectangular or square frames to lengthen face', 'Avoid small, round frames which can accentuate roundness'],
    Square: ['Round or oval frames to soften angles', 'Rimless or semi-rimless styles', 'Avoid boxy, angular frames that echo face shape'],
    Heart: ['Frames wider at the bottom to balance a broader forehead', 'Light-colored or rimless frames', 'Cat-eye or oval shapes work well'],
    Diamond: ['Frames that highlight cheekbones and eyes', 'Cat-eye or oval shapes', 'Rimless styles to highlight facial features'],
    Triangle: ['Frames with detailing or color on top half', 'Cat-eye shapes or frames with a straight top line', 'Avoid narrow frames that emphasize chin']
  };
};
export const getHowToMeasure = () => {
  return [{
    title: 'Frame Width',
    description: 'Measure the entire horizontal front of the frame from hinge to hinge.',
    image: 'https://images.unsplash.com/photo-1633621407114-7b7d085bc2fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80'
  }, {
    title: 'Lens Width',
    description: 'Measure the horizontal width of one lens.',
    image: 'https://images.unsplash.com/photo-1633621407114-7b7d085bc2fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80'
  }, {
    title: 'Bridge Width',
    description: 'Measure the distance between the lenses (where the bridge sits on your nose).',
    image: 'https://images.unsplash.com/photo-1633621407114-7b7d085bc2fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80'
  }, {
    title: 'Temple Length',
    description: 'Measure from the hinge to the end of the temple (the part that goes over your ear).',
    image: 'https://images.unsplash.com/photo-1633621407114-7b7d085bc2fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80'
  }, {
    title: 'Lens Height',
    description: 'Measure the vertical height of the lens.',
    image: 'https://images.unsplash.com/photo-1633621407114-7b7d085bc2fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80'
  }];
};