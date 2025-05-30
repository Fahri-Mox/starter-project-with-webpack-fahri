import Map from '../utils/map';

export async function reportMapper(student) {
  return {
    ...student,
    location: {
      ...student.location,
      placeName: await Map.getPlaceNameByCoordinate(
        student.lat,
        student.lon,
      ),
    },
  };
}
