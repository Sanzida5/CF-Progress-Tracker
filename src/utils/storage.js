import { seedGoals, seedProblems, seedProfile } from './seedData.js';

const KEYS = {
  problems: 'cf_tracker_problems',
  goals: 'cf_tracker_goals',
  profile: 'cf_tracker_profile'
};

export function loadState() {
  return {
    problems: read(KEYS.problems, seedProblems),
    goals: read(KEYS.goals, seedGoals),
    profile: read(KEYS.profile, seedProfile)
  };
}

export function saveProblems(problems) {
  write(KEYS.problems, problems);
}

export function saveGoals(goals) {
  write(KEYS.goals, goals);
}

export function saveProfile(profile) {
  write(KEYS.profile, profile);
}

export function resetState() {
  localStorage.removeItem(KEYS.problems);
  localStorage.removeItem(KEYS.goals);
  localStorage.removeItem(KEYS.profile);
}

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key} from localStorage`, error);
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not save ${key} to localStorage`, error);
  }
}
