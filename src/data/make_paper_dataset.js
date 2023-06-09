const result = db.paperlist_paper.aggregate([
], { allowDiskUse: true })

let csv = 'sample_name,sample_id,composition,sample_info\n'
result.forEach(function(doc, index) {
    var csvRow = [
        doc.sample_name,
        doc.sample_id,
        doc.composition,
        doc.sample_info,
    ].map(value => {
        if (Array.isArray(value)) {
            return '"' + JSON.stringify(value) + '"'
        }
        return JSON.stringify(value)
    }).join(",");
    csv += csvRow + '\n';
});

print(csv);