export const getIndexOfClassInAttendanceArray = (arr, i) => {
    let indexOfClass;
    if (arr.some((oneClass, index) => {
        if (oneClass.classNumber === i + 1) {
            indexOfClass = index;
            return true;
        }
    })) return indexOfClass;

    return -1;
};