# NINTENDO ENTERTAINMENT SYSTEM

Reference:
 * [Copetti](https://www.copetti.org/writings/consoles/nes/)
 * [NES Dev](https://www.nesdev.org/wiki/Nesdev_Wiki)

 Components:
  * NESEMU - Heart of the Emulator, interfacing with HTML / CSS frontend.
  * NESMEM - Memory Block with HexDump
  * NESDSK - SMS ROM header decode
  * NESCPU - Central Processing Unit based on 6502
  * NESPPU - Picture Processing Unit.
  * NESAPU - Audio Processing Unit.

TBD:
 * CPU execute function (fetch and decode are done).
 * PPU to be started
 * APU to be started.
 * DSK is done for mapper 1.
 * EMU is done for memorymapper, missing emulator refresh and cycles timings.