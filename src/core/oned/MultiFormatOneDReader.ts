/*
 * Copyright 2008 ZXing authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*namespace com.google.zxing.oned {*/

import BarcodeFormat from '../BarcodeFormat';
import BitArray from './../common/BitArray';
import Code39Reader from './Code39Reader';
import Code128Reader from './Code128Reader';
import DecodeHintType from './../DecodeHintType';
import ITFReader from './ITFReader';
import MultiFormatUPCEANReader from './MultiFormatUPCEANReader';
import NotFoundException from '../NotFoundException';
import OneDReader from './OneDReader';
import Result from '../Result';

/**
 * @author Daniel Switkin <dswitkin@google.com>
 * @author Sean Owen
 */
export default class MultiFormatOneDReader extends OneDReader {

    private readers: OneDReader[] = [];

    public constructor(hints: Map<DecodeHintType, any>) {
        super();
        const possibleFormats = !hints ? null : <BarcodeFormat[]>hints.get(DecodeHintType.POSSIBLE_FORMATS);
        const useCode39CheckDigit = hints && hints.get(DecodeHintType.ASSUME_CODE_39_CHECK_DIGIT) !== undefined;

        if (possibleFormats) {
            if (possibleFormats.indexOf(BarcodeFormat.EAN_13) >= 0) {
                this.readers.push(new MultiFormatUPCEANReader(hints));
            }
            // if (possibleFormats.indexOf(BarcodeFormat.EAN_13) >= 0 ||
            //     possibleFormats.indexOf(BarcodeFormat.UPC_A) >= 0  ||
            //     possibleFormats.indexOf(BarcodeFormat.EAN_8) >= 0  ||
            //     possibleFormats.indexOf(BarcodeFormat.UPC_E)) >= 0 {
            //   readers.push(new MultiFormatUPCEANReader(hints));
            // }
            if (possibleFormats.indexOf(BarcodeFormat.CODE_39) >= 0) {
               this.readers.push(new Code39Reader(useCode39CheckDigit));
            }
            // if (possibleFormats.indexOf(BarcodeFormat.CODE_93) >= 0) {
            //    this.readers.push(new Code93Reader());
            // }
            if (possibleFormats.indexOf(BarcodeFormat.CODE_128) >= 0) {
                this.readers.push(new Code128Reader());
            }
            if (possibleFormats.indexOf(BarcodeFormat.ITF) >= 0) {
               this.readers.push(new ITFReader());
            }
            // if (possibleFormats.indexOf(BarcodeFormat.CODABAR) >= 0) {
            //    this.readers.push(new CodaBarReader());
            // }
            // if (possibleFormats.indexOf(BarcodeFormat.RSS_14) >= 0) {
            //    this.readers.push(new RSS14Reader());
            // }
            // if (possibleFormats.indexOf(BarcodeFormat.RSS_EXPANDED) >= 0) {
            //   this.readers.push(new RSSExpandedReader());
            // }
        }
        if (this.readers.length === 0) {
            // this.readers.push(new MultiFormatUPCEANReader(hints));
            this.readers.push(new Code39Reader());
            // this.readers.push(new CodaBarReader());
            // this.readers.push(new Code93Reader());
            this.readers.push(new MultiFormatUPCEANReader(hints));
            this.readers.push(new Code128Reader());
            this.readers.push(new ITFReader());
            // this.readers.push(new RSS14Reader());
            // this.readers.push(new RSSExpandedReader());
        }
    }

    // @Override
    public decodeRow(
        rowNumber: number,
        row: BitArray,
        hints: Map<DecodeHintType, any>
    ): Result {

        for (let i = 0; i < this.readers.length; i++) {
            try {
                return this.readers[i].decodeRow(rowNumber, row, hints);
            } catch (re) {
                // continue
            }
        }

        throw new NotFoundException();
    }

    // @Override
    public reset(): void {
        this.readers.forEach(reader => reader.reset());
    }
}
