import { HeroBlock } from "./Hero";
import { FeaturesBlock } from "./Features";
import { ImageTextBlock } from "./ImageText";
import { CtaBlock } from "./Cta";
import { CustomHtmlBlock } from "./CustomHtml";
import { SectionBlock } from "./Section";
import { BlockDefinition } from "../types";

export const blockRegistry: Record<string, BlockDefinition> = {
  hero: HeroBlock,
  features: FeaturesBlock,
  imageText: ImageTextBlock,
  cta: CtaBlock,
  customHtml: CustomHtmlBlock,
  section: SectionBlock,
};
