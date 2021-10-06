import { Principal } from "@dfinity/principal";
import { getCrc32 } from "@dfinity/principal/lib/cjs/utils/getCrc";
import { sha224 } from "@dfinity/principal/lib/cjs/utils/sha224.js";

export const getAccountId = (principal: string, id: number) => {
    const subaccount = Buffer.from(getSubAccountArray(id));
    const acc_buf = Buffer.from("\x0Aaccount-id");
    const pri_buf = Buffer.from(Principal.fromText(principal).toUint8Array())

    const buff = Buffer.concat([
        acc_buf,
        pri_buf,
        subaccount,
    ]);

    const sha = sha224(buff);
    const aId = Buffer.from(sha);

    return addCrc32(aId).toString("hex");
};

export const addCrc32 = (buf: Buffer): Buffer => {
    const crc32Buf = Buffer.alloc(4);
    crc32Buf.writeUInt32BE(getCrc32(buf), 0);
    return Buffer.concat([crc32Buf, buf]);
};

const getSubAccountArray = (index: number): Uint8Array => {
    //32 bit number only
    return new Uint8Array(Array(28).fill(0).concat(to32bits(index)));
};

const to32bits = num => {
    let b = new ArrayBuffer(4);
    new DataView(b).setUint32(0, num);
    return Array.from(new Uint8Array(b));
}