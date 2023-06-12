const sample_info_keys = [
    'MaterialFamily',
    'DataType',
    'Form',
    'FabricationProcess',
    'FabricationProcess 2',
    'FabricationProcess 3',
    'ElectricalMeasurement',
    'ThermalMeasurement',
    'Purity',
    'RelativeDensity',
    'GrainSize',
    'Other',
    'laser flash and different thermal analyzer',
    'Differential thermal analyzer',
    'LaserFlash',
    'DifferentialThermalAnalyzer',
    'Composition conversion',
    'Measurement axis',
    'DataType',
    'Form',
    'FabricationProcess',
    'MagneticMeasurement',
    'Purity',
    'RelativeDensity',
    'GrainSize',
    ' Measurement temperature',
    'saturation magnetization',
    'remanence magnetion',
    'coercivity',
    ' coercivity',
    'magnetic field',
    'Measurement temperature',
    'emanence magnetion',
    'Saturation magnetization',
    'oercivity',
    '  remanence magnetion',
    ' remanence magnetion',
    'saturation magnetizatio',
    'direction',
    'sintering temperature',
    'composition type',
    'lattice parameter',
    'annealing condition',
    'other sample process info',
    'sample info',
    'AC/QC type',
    'measurement condition',
    'other sample process info 2',
    'Applied field',
    'DataType',
    'Form',
    'ThermalMeasurement',
    'Purity',
    'AbsoluteDensity',
    'RelativeDensity',
    'Porosity',
    'ClosedPorosity',
    'GrainSize',
    'PoreSize',
    'Cathode active material',
    'Cathode conductive agent',
    'Cathode binder 1',
    'Cathode binder 2',
    'Cathode additive 1',
    'Cathode additive 2',
    'Cathode current collector',
    'Anode active material',
    'Anode conductive agent',
    'Anode binder 1',
    'Anode binder 2',
    'Anode additive 1',
    'Anode additive 2',
    'Solvent 1',
    'Solvent 2',
    'Solvent 3',
    'Solute 1',
    'Solute 2',
    'Solute 3',
    'Electrolyte Additive 1',
    'Electrolyte Additive 2',
    'Electrolyte Additive 3',
    'Ratio of electrolyte to sulfur (E/S ratio)',
    'Cathode areal density (cathode loading)',
    'Cathode areal capacity',
    'Cathode volumetric density',
    'N/P ratio|A/C ratio',
    'Upper voltage limit',
    'Lower voltage limit',
    'Cell type',
    'Current density',
    'Anode areal capacity',
    'Hysteresis',
    'Coulombic efficiency',
    'Anode current collector',
    'Separator'
]

const sample_info_comments = sample_info_keys.map(key => {
    return key + '_c'
})

const result = db.paperlist_sample.aggregate([{
        $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
            sample_name: "$samplename",
            sample_id: "$sampleid",
            composition: 1,
            sample_info: "$sampleinfo",
        },
    },
    {
        $limit: 10
    }
], { allowDiskUse: true })

let csv = 'sample_name,sample_id,composition,sample_info,' + sample_info_keys.join(',') + sample_info_comments.join(',') + '\n'
result.forEach(function(doc, index) {
    var csvRow = [
        doc.sample_name,
        doc.sample_id,
        doc.composition,
        doc.sample_info,
    ].map(value => {
        if (typeof value === 'object') {
            value = JSON.parse((JSON.stringify(value)))
            let result = []
            result += sample_info_keys.map(key => {
                if (key in value) {
                    return '"' + value[key]['category'] + '"'
                } else {
                    return ""
                }
            }).join(',')
            result += sample_info_comments.map(comment => {
                if (comment in value) {
                    return '"' + value[comment]['comments'] + '"'
                } else {
                    return ""
                }
            }).join(',')
            return result
                // print(Object.keys(value))
                // "[object BSON]" の場合、ダブルクォートをエスケープ
                // return '"' + JSON.stringify(value).replace(/"/g, "'") + '"';
                // value = value.replace(/"/g, '\\"');
        }
        if (Array.isArray(value)) {
            return '"' + JSON.stringify(value) + '"'
        }
        return JSON.stringify(value)
    }).join(",");
    csv += csvRow + '\n';
});

print(csv);
