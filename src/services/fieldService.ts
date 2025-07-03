import { Field, MainSport, SubCourt, TimeSlot, Owner, Review } from '../types/field';
import { allFields, popularFields, mainSports } from '../data/field';

export const getPopularFields = (): Promise<Field[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(popularFields || []);
    }, 300);
  });
};

export const getAllFields = (): Promise<Field[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(allFields || []);
    }, 500);
  });
};

export const getMainSports = (): Promise<MainSport[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mainSports || []);
    }, 200);
  });
};

export const getFieldsBySport = (sport: string): Promise<Field[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredFields = allFields.filter(field => field.sport === sport);
      resolve(filteredFields || []);
    }, 400);
  });
};

export const getSubCourts = (fieldId: number): Promise<SubCourt[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const field = allFields.find(f => f.id === fieldId);
      resolve(field?.subCourts || []);
    }, 300);
  });
};

export const getTimeSlots = (fieldId: number, subCourtId: string): Promise<TimeSlot[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const field = allFields.find(f => f.id === fieldId);
      const subCourt = field?.subCourts.find(sc => sc.id === subCourtId);
      resolve(subCourt?.timeSlots || []);
    }, 250);
  });
};

export const getOwnerByField = (fieldId: number): Promise<Owner | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const field = allFields.find(f => f.id === fieldId);
      resolve(field?.owner);
    }, 200);
  });
};

export const getReviewsByField = (fieldId: number): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const field = allFields.find(f => f.id === fieldId);
      resolve(field?.reviewsList || []);
    }, 200);
  });
};