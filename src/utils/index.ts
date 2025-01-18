export const getLowestIntegerByDivision = (num:number) => {
    let result = num;
    if (num > 9) {
        let _temp = num;
        let _integer = 2;
        while (_temp > 9) {
            if ((num / _integer) <= 9) {
                _temp = num / _integer;
                result = _temp;
                break;
            } else {
                _integer++;
            }
        }
        result = Math.floor(result);
    }
    return result;
};
  