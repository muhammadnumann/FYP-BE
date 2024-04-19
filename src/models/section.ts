import { Schema, model } from 'mongoose';

export interface ISection {
  _id: any;
  sectionImage: string,
  sectionContent: string,
  sectionTitle: string,
  sectionSubTitle: string,
  imagealignment: {
    type: String,
    enum: ['left', 'right'],
    default: 'left'
  }
}

const sectionSchema = new Schema<ISection>({
  sectionImage: { type: String },
  sectionContent: { type: String, required: true },
  sectionTitle: { type: String, required: true },
  sectionSubTitle: { type: String, required: false },
  imagealignment: { type: String },
});

const Section = model<ISection>('tbl-section', sectionSchema);

export default Section;
