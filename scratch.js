const { XMLParser } = require('fast-xml-parser');
const xml = `<?xml version="1.0" encoding="utf-8"?>
<xml>
    <status>TRUE</status>
    <pesan/>
    <data>
        <item>
            <IDKelas>36250</IDKelas>
            <NamaKelas>IF22H</NamaKelas>
            <KodeMK>IF52110030</KodeMK>
            <NamaMK>Pengantar Finansial</NamaMK>
            <SKS>2</SKS>
            <NamaProgdi>Informatika</NamaProgdi>
            <JadwalKuliah>Senin, 18:30-20:20 / ONLINE 4</JadwalKuliah>
            <NamaDosen>Lufthia Sevriana, Asep Maksum</NamaDosen>
            <JenisPerkuliahan>Online</JenisPerkuliahan>
            <NIM>0112522006</NIM>
            <NamaMahasiswa>Ammar Al Ghifary</NamaMahasiswa>
        </item>
    </data>
    <jml_data>8</jml_data>
</xml>`;

const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: true
});
const result = parser.parse(xml);
console.log(JSON.stringify(result, null, 2));
