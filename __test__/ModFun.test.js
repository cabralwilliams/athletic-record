const methods = require("../lib/model-objects");

//code 0 = miles, code 1 = km, code 2 = meters, code 3 = yards
test("Test distance conversion functions.", () => {
    const distance1 = 5; //miles
    const distance2 = 10; //kilometers

    expect(methods.getYards(distance1,0)).toEqual(distance1*1760); //Miles to Yards
    expect(methods.getMeters(distance2,1)).toEqual(distance2*1000); //Kilometers to Meters
    expect(methods.getMiles(distance2,1)).toEqual(distance2/1.609344); //Kilometers to Miles
    expect(methods.getKilometers(distance1,0)).toEqual(distance1*1.609344); //Miles to Kilometers
});

test("Test to see if time formatting is working properly.", () => {
    const time1 = 3609.4687;
    const time2 = 3598.33;
    const time3 = 657.3241;
    
    expect(methods.formatTime(time1)).toEqual("1:00:09.469");
    expect(methods.formatTime(time2)).toEqual("59:58.33");
    expect(methods.formatTime(time3)).toEqual("10:57.324");
    expect(methods.formatTime(65.89999)).toEqual("1:05.90");
    expect(methods.formatTime(3599.9999)).toEqual("1:00:00");
    expect(methods.formatTime(49.9948)).toEqual("49.995");
});