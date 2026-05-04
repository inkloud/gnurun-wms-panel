import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from 'react-router';

declare const dymo: {
    label: {
        framework: {
            getPrinters: () => Array<{printerType: string; name: string}>;
            openLabelXml: (xml: string) => {
                render: () => string;
                print: (printer: string) => void;
            };
        };
    };
};

const buildXml = (barcode: string | null, productCode: string | null, whLocation: string | null, code39: string | null): string => {
    if (code39) {
        const safe = code39.toUpperCase().replace(/[^A-Z0-9\-. $/+%]/g, '');
        return `<?xml version="1.0" encoding="utf-8"?>
<DieCutLabel Version="8.0" Units="twips">
  <PaperOrientation>Landscape</PaperOrientation>
  <Id>Shipping</Id>
  <PaperName>30323 Shipping</PaperName>
  <DrawCommands><RoundRectangle X="0" Y="0" Width="3060" Height="5715" Rx="270" Ry="270" /></DrawCommands>
  <ObjectInfo>
    <BarcodeObject>
      <Name>CODICE A BARRE</Name>
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
      <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
      <LinkedObjectName></LinkedObjectName>
      <Rotation>Rotation0</Rotation>
      <IsMirrored>False</IsMirrored>
      <IsVariable>True</IsVariable>
      <Text>${safe}</Text>
      <Type>Code39</Type>
      <Size>Medium</Size>
      <TextPosition>Bottom</TextPosition>
      <TextFont Family="Arial" Size="36" Bold="False" Italic="False" Underline="False" Strikeout="False" />
      <CheckSumFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False" />
      <TextEmbedding>None</TextEmbedding>
      <ECLevel>0</ECLevel>
      <HorizontalAlignment>Center</HorizontalAlignment>
      <QuietZonesPadding Left="0" Top="0" Right="0" Bottom="0" />
    </BarcodeObject>
    <Bounds X="307" Y="510" Width="5323" Height="2145" />
  </ObjectInfo>
</DieCutLabel>`;
    }

    const locationFlat = (whLocation ?? '').replaceAll('.', '');
    return `<?xml version="1.0" encoding="utf-8"?>
<DieCutLabel Version="8.0" Units="twips">
  <PaperOrientation>Landscape</PaperOrientation>
  <Id>Shipping</Id>
  <PaperName>30323 Shipping</PaperName>
  <DrawCommands><RoundRectangle X="0" Y="0" Width="3060" Height="5715" Rx="270" Ry="270" /></DrawCommands>
  <ObjectInfo>
    <BarcodeObject>
      <Name>CODICE A BARRE</Name>
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
      <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
      <LinkedObjectName></LinkedObjectName>
      <Rotation>Rotation0</Rotation>
      <IsMirrored>False</IsMirrored>
      <IsVariable>True</IsVariable>
      <Text>${barcode}</Text>
      <Type>Ean13</Type>
      <Size>Large</Size>
      <TextPosition>Bottom</TextPosition>
      <TextFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False" />
      <CheckSumFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False" />
      <TextEmbedding>Full</TextEmbedding>
      <ECLevel>0</ECLevel>
      <HorizontalAlignment>Center</HorizontalAlignment>
      <QuietZonesPadding Left="0" Top="0" Right="0" Bottom="0" />
    </BarcodeObject>
    <Bounds X="307" Y="1365" Width="5323" Height="1365" />
  </ObjectInfo>
  <ObjectInfo>
    <TextObject>
      <Name>TESTO</Name>
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
      <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
      <LinkedObjectName></LinkedObjectName>
      <Rotation>Rotation0</Rotation>
      <IsMirrored>False</IsMirrored>
      <IsVariable>False</IsVariable>
      <HorizontalAlignment>Left</HorizontalAlignment>
      <VerticalAlignment>Top</VerticalAlignment>
      <TextFitMode>ShrinkToFit</TextFitMode>
      <UseFullFontHeight>True</UseFullFontHeight>
      <Verticalized>False</Verticalized>
      <StyledText>
        <Element>
          <String>${productCode}-${locationFlat}</String>
          <Attributes>
            <Font Family="Arial" Size="22" Bold="False" Italic="False" Underline="False" Strikeout="False" />
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
          </Attributes>
        </Element>
      </StyledText>
    </TextObject>
    <Bounds X="307" Y="315" Width="5323" Height="735" />
  </ObjectInfo>
</DieCutLabel>`;
};

const PrintPage: React.FC = function () {
    const [params] = useSearchParams();
    const [printers, setPrinters] = useState<string[]>([]);
    const [selectedPrinter, setSelectedPrinter] = useState('');
    const [previewSrc, setPreviewSrc] = useState('');
    const labelRef = useRef<ReturnType<typeof dymo.label.framework.openLabelXml> | null>(null);

    const barcode = params.get('b');
    const productCode = params.get('c');
    const whLocation = params.get('w');
    const code39 = params.get('code39');

    useEffect(() => {
        const xml = buildXml(barcode, productCode, whLocation, code39);
        labelRef.current = dymo.label.framework.openLabelXml(xml);

        const pngData = labelRef.current.render();
        setPreviewSrc('data:image/png;base64,' + pngData);

        const available = dymo.label.framework
            .getPrinters()
            .filter((p) => p.printerType === 'LabelWriterPrinter')
            .map((p) => p.name);
        setPrinters(available);
        if (available.length > 0) setSelectedPrinter(available[0]);

        if (available.length > 0 && labelRef.current) {
            labelRef.current.print(available[0]);
        }
    }, []);

    const handlePrint = () => {
        if (!labelRef.current || !selectedPrinter) return;
        labelRef.current.print(selectedPrinter);
    };

    return (
        <div className="container py-4">
            <div className="mb-3">
                <img id="labelImage" src={previewSrc} alt="Label preview" className="img-fluid" />
            </div>
            <div className="mb-3">
                <select
                    className="form-select"
                    value={selectedPrinter}
                    onChange={(e) => setSelectedPrinter(e.target.value)}
                >
                    {printers.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
            </div>
            <button className="btn btn-primary" type="button" onClick={handlePrint}>
                Print
            </button>
        </div>
    );
};

export default PrintPage;
