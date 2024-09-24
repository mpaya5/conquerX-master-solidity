fn main() {
    // Mutable
    let  mut _x: i32 = 5;
    _x = 6;

    // Cannot be mutable
    const TRES_HORAS_EN_SEGUNDOS: u32 = 60*60*3;

    // Shadowing
    let _y= 5;
    println!("The X's value is {_y}");
    let _y: i32= 6;
    println!("The X's is {_y}"); // Will appear 6

    // Float values
    let x_float = 2.0;
    let y_float: f32 = 3.0;
    println!("The float x value is {x_float} and the float y is {y_float}");

    // MATH
    let _sum: f64 = 5.0+10 as f64; // Changing 10 to float

    let _difference: f64 = 95.5-4.3;

    let _product: i32 = 4*30;

    let _quotient: f64 = 56.7 / 32.2;
    let _truncated: i32 = -5/3;

    let _remainder: i32 = 43%5;

    // Bools
    let _t = true;
    let _f: bool = false;

    // Char
    let _c = 'z';
    let _z: char = 'Z';

    // Tuple
    let _tup: (i32, f64, char) = (500, 6.4, 'z'); // Not mutable
    let (x_tup,y_tup,z_tup) = _tup;
    println!("{x_tup} | {y_tup} | {z_tup}");
    let five_hundred = _tup.0;
    println!("{five_hundred}");
}
