// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @title 64x64 fixed-point constants compatible with ABDKMath64x64 library
 */
library ABDKMath64x64Constants {
    int128 internal constant MIN_64x64 = type(int128).min;
    int128 internal constant MAX_64x64 = type(int128).max;
    int128 internal constant ONE_64x64 = 0x10000000000000000;
    int128 internal constant E_64x64 = 0x2b7e151628aed1975;
    int128 internal constant PI_64x64 = 0x3243f6a8885a2f7a4;
}
