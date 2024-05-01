import { Request, Response } from 'express';
import logger from '../../logger';
import Services from '../../models/services';

export const servicesList = async (req: Request, res: Response) => {
    console.log("Services List")
    try {
        const services = await Services.find()
        return res.status(200).json({
            total: services.length,
            services
        }
        );
    } catch (error) {
        logger.error({
            level: 'debug',
            message: `${'Cant Find'} , ${error}`,
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(404).json({
            success: false,
            message: 'Cant Find'
        });
    }

};

export const AddSections = async (req: Request, res: Response) => {
    // const { sectionTitle, sectionDescription } = req.body;
    // console.log(req.body)
    // console.log(req.query)
    console.log(req.files)
    res.status(404).json({ message: "succesfull" });

    // const section = new Section({
    //     sectionTitle: sectionTitle,
    //     sectionDescription: sectionDescription,
    //     sectionImage: sectionImage
    // });

    try {
        // const savedSection = await section.save();
        // const sectionId = savedSection._id;
        // let mySectionlId = req.cookies.mySectionlId;
        // if (!mySectionlId) {
        //     const createService = new Services({
        //         sections: [sectionId]
        //     });
        //     const savedService = await createService.save();
        //     mySectionlId = savedService._id.toString();
        //     res.cookie('mySectionlId', mySectionlId);
        //     res.send(savedService);
        // } else {
        //     const service: Iservices | null = await Services.findById(mySectionlId);
        //     if (service) {
        //         service.sections.push(sectionId);
        //         await service.save();
        //         res.status(200).json(savedSection);
        //     } else {
        //         res.status(404).json({ message: 'Service not found' });
        //     }
        // }
        // res.status(404).json(req.file);

    } catch (err) {
        res.status(500).send(err);
    }
};
export const FindOneSection = async (req: Request, res: Response) => {
    const id = req.params['0']
    try {
        // const section = await Section.findById(id)
        // console.log(section)
        // return res.status(200).json(
        //     section
        // );
    } catch (error) {
        logger.error({
            level: 'debug',
            message: `${'Cant Find'} , ${error}`,
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(404).json({
            success: false,
            message: 'Cant Find'
        });
    }

};
export const EditSection = async (req: Request, res: Response) => {
    const { id, sectionTitle, sectionDescription } = req.body;
    let sectionImage = req.file?.path;
    console.log("Edit section")
    try {
        // if (id) {
        //     const section = await Section.findByIdAndUpdate(id, {
        //         sectionTitle: sectionTitle,
        //         sectionDescription: sectionDescription,
        //         sectionImage: sectionImage,
        //     }, (err, result) => {
        //         if (err)
        //             res.send(err)

        //     })
        //     return res.status(200).json({
        //         success: true,
        //         message: 'SuccessFully Edit',
        //         section: section
        //     });
        // } else {
        //     return res.status(200).json({
        //         success: false,
        //         message: 'Id is Null to Edit'
        //     });
        // }
    } catch (error) {
        logger.error({
            level: 'debug',
            message: `${'Edit Failure'} , ${error}`,
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
            success: false,
            message: 'Fail to Edit'
        });
    }
};
export const DeleteSection = async (req: Request, res: Response) => {
    const id = req.params['0'];
    try {
        // const sectionsToDelete = await Section.find({ _id: id });
        // const del = await Section.deleteOne({ _id: id });
        // await Services.updateMany(
        //     { sections: { $in: sectionsToDelete.map(section => section._id) } },
        //     { $pull: { sections: { $in: sectionsToDelete.map(section => section._id) } } }
        // );
        // return res.status(200).json(del);
    } catch (error) {
        logger.error({
            level: 'debug',
            message: `${'Cant Find'} , ${error}`,
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(404).json({
            success: false,
            message: 'Cant Find'
        });
    }
};



