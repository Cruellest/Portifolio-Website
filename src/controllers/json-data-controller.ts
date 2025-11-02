import { useJsonData } from "../services/json/json-data-retriver";

/**
 * Retrieves personal information data from the portfolio store
 * Includes name, email, phone, location, etc.
 *
 * @returns {Object} Personal data object containing user's personal information
 * @example
 * const personal = getPersonalData()
 * console.log(personal.name)
 */
function getPersonalData() {
  const jsonDataStore = useJsonData();
  return jsonDataStore.getData.personal;
}

/**
 * Retrieves section titles for portfolio sections
 * Used for rendering section headers and navigation labels
 *
 * @returns {Object} Object containing titles for all portfolio sections
 * @example
 * const titles = getSectionsData()
 * console.log(titles.aboutMe)
 */
function getSectionsData() {
  const jsonDataStore = useJsonData();
  return jsonDataStore.getData.section_titles;
}

/**
 * Retrieves professional summary/bio data
 * Contains a brief overview of professional background and goals
 *
 * @returns {Object} Summary data object with professional bio information
 * @example
 * const summary = getSummaryData()
 * console.log(summary.bio)
 */
function getSummaryData() {
  const jsonDataStore = useJsonData();
  return jsonDataStore.getData.summary;
}

/**
 * Retrieves skills data from the portfolio
 * Includes technical skills, languages, tools, and proficiency levels
 *
 * @returns {Object} Skills data containing categories and proficiency information
 * @example
 * const skills = getSkillsData()
 * skills.forEach(skill => console.log(skill.name, skill.level))
 */
function getSkillsData() {
  const jsonDataStore = useJsonData();
  return jsonDataStore.getData.skills;
}

/**
 * Retrieves professional experience/work history data
 * Includes job titles, companies, dates, and descriptions
 *
 * @returns {Object} Experience data containing work history entries
 * @example
 * const experience = getExperienceData()
 * experience.forEach(job => console.log(job.company, job.position))
 */
function getExperienceData() {
  const jsonDataStore = useJsonData();
  return jsonDataStore.getData.experience;
}

/**
 * Retrieves education history data
 * Includes schools, degrees, graduation dates, and achievements
 *
 * @returns {Object} Education data containing academic history entries
 * @example
 * const education = getEducationData()
 * education.forEach(edu => console.log(edu.school, edu.degree))
 */
function getEducationData() {
  const jsonDataStore = useJsonData();
  return jsonDataStore.getData.education;
}

/**
 * Retrieves UI copy/strings from data.json
 * Supports both "ui" and legacy "ui_strings" keys
 */
function getUiStrings() {
  const jsonDataStore = useJsonData();
  const data = jsonDataStore.getData;
  return data.ui ?? {};
}

export {
  getPersonalData,
  getSectionsData,
  getSummaryData,
  getSkillsData,
  getExperienceData,
  getEducationData,
  getUiStrings
};