const HEADER = "You are helping a founder package their pitch. Based on the transcript below,";

export const ONE_LINER_PROMPT = `${HEADER} write the sharpest possible one-sentence description of the business. Return JSON only, no markdown: {"oneLiner":"..."}

Transcript:`;

export const ELEVATOR_PROMPT = `${HEADER} write three elevator pitches of increasing depth. Return JSON only, no markdown: {"fifteenSec":"a 15-second pitch","thirtySec":"a 30-second pitch","sixtySec":"a 60-second pitch"}

Transcript:`;

export const PROBLEM_STATEMENT_PROMPT = `${HEADER} write the problem statement. Return JSON only, no markdown: {"problemStatement":"exactly two paragraphs separated by \\n\\n"}

Transcript:`;

export const VALUE_PROP_PROMPT = `${HEADER} write the value proposition as exactly 3 sharp bullet points. Return JSON only, no markdown: {"valueProposition":["bullet 1","bullet 2","bullet 3"]}

Transcript:`;

export const TARGET_CUSTOMER_PROMPT = `${HEADER} write a detailed description of the target customer. Return JSON only, no markdown: {"targetCustomer":"..."}

Transcript:`;

export const GTM_PROMPT = `${HEADER} write a concrete go-to-market strategy in 2-3 sentences. Return JSON only, no markdown: {"gtmStrategy":"..."}

Transcript:`;

export const VALIDATION_QUESTIONS_PROMPT = `${HEADER} write exactly 5 problem-validation interview questions a founder could ask prospective customers. Return JSON only, no markdown: {"validationQuestions":["question 1","question 2","question 3","question 4","question 5"]}

Transcript:`;

export const SWOT_PROMPT = `${HEADER} write a SWOT analysis, 2-4 short items per bucket. Return JSON only, no markdown: {"swot":{"strengths":["..."],"weaknesses":["..."],"opportunities":["..."],"threats":["..."]}}

Transcript:`;

export const RISK_ASSESSMENT_PROMPT = `${HEADER} identify the 3-5 biggest risks to this business succeeding, each one concrete sentence. Return JSON only, no markdown: {"riskAssessment":["risk 1","risk 2","..."]}

Transcript:`;

export const FINANCIAL_PROJECTIONS_PROMPT = `${HEADER} sketch a lightweight financial projections skeleton as 4-6 short lines covering revenue model, cost structure, and realistic year-1 targets — clearly inferred estimates, not real numbers. Return JSON only, no markdown: {"financialProjections":["line 1","line 2","..."]}

Transcript:`;

export const LANDING_PAGE_PROMPT = `${HEADER} write landing page copy: a hero headline, a subheadline, and a call-to-action line, as one readable block of text. Return JSON only, no markdown: {"landingPageCopy":"..."}

Transcript:`;

export const INVESTOR_EMAIL_PROMPT = `${HEADER} draft a cold outreach email to an investor, including a subject line. Return JSON only, no markdown: {"investorEmail":"..."}

Transcript:`;

export const PRESS_RELEASE_PROMPT = `${HEADER} write a short press-release-style launch announcement. Return JSON only, no markdown: {"pressRelease":"..."}

Transcript:`;

export const LINKEDIN_PROMPT = `${HEADER} write a LinkedIn launch announcement post in the founder's voice, ending with 3-5 relevant hashtags. Return JSON only, no markdown: {"linkedinAnnouncement":"..."}

Transcript:`;

export const NARRATION_SCRIPT_PROMPT = `${HEADER} write a spoken narration script a founder could read aloud over an 8-slide pitch deck (problem, solution, market, business model, traction, competitive advantage, team, ask) — natural spoken language, not slide bullet points. Return JSON only, no markdown: {"narrationScript":"..."}

Transcript:`;
