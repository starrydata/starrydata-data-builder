const propValues = [
    'Temperature',
    'Seebeck coefficient',
    'Electrical resistivity',
    'Electrical conductivity',
    'Thermal conductivity',
    'Power factor',
    'ZT',
    'Carrier mobility',
    'Hall coefficient',
    'Magnetic field',
    'Magnetic Field',
    'Magnetic field strength (H)',
    'Magnetization',
    'magnetization_per_weight',
    'magnetization_per_volume',
    'magnetization_Bohr',
    'C rate',
    'Cycle number',
    'Voltage',
    'Discharge capacity',
    'Charge capacity'
]

const result = db.paperlist_data.aggregate([{
        $sort: {
            created_at: -1,
        },
    },
    {
        $group: {
            _id: {
                figure_id: "$figureid",
                sample_id: "$sampleid",
            },
            latestRecord: {
                $first: "$$ROOT",
            },
        },
    },
    {
        $replaceRoot: {
            newRoot: "$latestRecord",
        },
    },
    {
        $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
            from: "databases_library",
            localField: "sourceid",
            foreignField: "pid",
            as: "libraries",
        },
    },
    {
        $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
            path: "$libraries",
            includeArrayIndex: "library_index",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
            project_oid: {
                $toObjectId: "$libraries.projectid",
            },
        },
    },
    {
        $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
            from: "databases_project",
            localField: "project_oid",
            foreignField: "_id",
            as: "projects",
        },
    },
    {
        $addFields: {
            project_name: {
                $map: {
                    input: "$projects",
                    as: "project",
                    in: "$$project.projectname"
                }
            }
        }
    },
    {
        $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
            from: "paperlist_figure",
            let: {
                figure_oid: {
                    $toObjectId: "$figureid",
                },
            },
            pipeline: [{
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$_id", "$$figure_oid"],
                            }, ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "paperlist_property",
                        let: {
                            prop_x_oid: {
                                $toObjectId: "$property_x",
                            },
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                        $eq: [
                                            "$_id",
                                            "$$prop_x_oid",
                                        ],
                                    }, ],
                                },
                            },
                        }, ],
                        as: "prop_x",
                    },
                },
                {
                    $lookup: {
                        from: "paperlist_property",
                        let: {
                            prop_y_oid: {
                                $toObjectId: "$property_y",
                            },
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                        $eq: [
                                            "$_id",
                                            "$$prop_y_oid",
                                        ],
                                    }, ],
                                },
                            },
                        }, ],
                        as: "prop_y",
                    },
                },
                {
                    $lookup: {
                        from: "paperlist_unit",
                        let: {
                            unit_y_oid: {
                                $toObjectId: "$unit_y",
                            },
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                        $eq: [
                                            "$_id",
                                            "$$unit_y_oid",
                                        ],
                                    }, ],
                                },
                            },
                        }, ],
                        as: "unit_y",
                    },
                },
                {
                    $lookup: {
                        from: "paperlist_unit",
                        let: {
                            unit_x_oid: {
                                $toObjectId: "$unit_x",
                            },
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                        $eq: [
                                            "$_id",
                                            "$$unit_x_oid",
                                        ],
                                    }, ],
                                },
                            },
                        }, ],
                        as: "unit_x",
                    },
                },
            ],
            as: "figures",
        },
    },
    {
        $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
            path: "$figures",
        },
    },
    {
        $unwind: {
            path: "$figures.prop_x",
        },
    },
    {
        $unwind: {
            path: "$figures.prop_y",
        },
    },
    {
        $unwind: {
            path: "$figures.unit_x",
        },
    },
    {
        $unwind: {
            path: "$figures.unit_y",
        },
    },
    {
        $addFields: {
            prop_x: "$figures.prop_x.propertyname",
            prop_y: "$figures.prop_y.propertyname",
            unit_x: "$figures.unit_x.unitname",
            unit_y: "$figures.unit_y.unitname",
        },
    },
    {
        $match: {
            prop_x: { $in: propValues },
            prop_y: { $in: propValues },
        }
    },
    {
        $lookup: {
            from: "paperlist_sample",
            let: {
                sample_oid: {
                    $toObjectId: "$sampleid",
                },
            },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$_id", "$$sample_oid"],
                    },
                },
            }, ],
            as: "samples",
        },
    },
    {
        $unwind: {
            path: "$samples",
        },
    },
    {
        $addFields: {
            sample_id: "$samples.sampleid",
        },
    },
    {
        $lookup: {
            from: "paperlist_paper",
            let: {
                paper_oid: {
                    $toObjectId: "$sourceid",
                },
            },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$_id", "$$paper_oid"],
                    },
                },
            }, ],
            as: "papers",
        },
    },
    {
        $unwind: {
            path: "$papers",
        },
    },
    {
        $addFields: {
            SID: "$papers.sid",
            DOI: "$papers.DOI",
        },
    },
    {
        $addFields: {
            x: {
                $map: {
                    input: "$data.x",
                    as: "x",
                    in: { $round: ["$$x", 6] }
                }
            },
            y: {
                $map: {
                    input: "$data.y",
                    as: "y",
                    in: { $round: ["$$y", 6] }
                }
            }
        }
    },
    {
        $project: {
            SID: 1,
            DOI: 1,
            composition: 1,
            sample_id: 1,
            figure_id: "$figures.figureid",
            prop_x: 1,
            prop_y: 1,
            unit_x: 1,
            unit_y: 1,
            x: 1,
            y: 1,
            project_names: 1,
        },
    },
    {
        $limit: 10,
    }
], { allowDiskUse: true })

let csv = 'SID,DOI,composition,sample_id,figure_id,prop_x,prop_y,unit_x,unit_y,x,y,project_names\n'
result.forEach(function(doc, index) {
    var csvRow = [
        doc.SID,
        doc.DOI,
        doc.composition,
        doc.sample_id,
        doc.figure_id,
        doc.prop_x,
        doc.prop_y,
        doc.unit_x,
        doc.unit_y,
        doc.x,
        doc.y,
        doc.project_names,
    ].map(value => {
        print(value)
        value = JSON.parse((JSON.stringify(value)))
        if (Array.isArray(value)) {
            return '"' + value + '"'
        }
        return JSON.stringify(value)
    }).join(",");
    csv += csvRow + '\n';
});

print(csv);
