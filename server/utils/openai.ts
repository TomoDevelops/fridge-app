import OpenAI from "openai";

const config = useRuntimeConfig();

export const openai = new OpenAI({
  apiKey: config.openaiApiKey,
  organization: "org-PhCYgnKnubN0zjEGP63lzMii",
  project: "proj_sHap9ikfFF7oVB9ptl0tIscz",
});
