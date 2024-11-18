//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.14;

contract Memoria {
    struct Alumno {
        string nombre;
    }

    mapping (uint8 => Alumno) alumnos;

    function getAlumno () external view returns (string memory) {
        return alumnos[0].nombre;
    }

    function modifyAlumno () external {
        Alumno storage _alumno = alumnos[0];
        _alumno.nombre = "Luis";
    }
}