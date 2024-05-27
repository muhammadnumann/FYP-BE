import { Request, Response } from 'express';
import logger from '../../logger';
import Services from '../../models/services';
import { verifyToken } from '../../helpers/jwt.helper';
const { spawnSync } = require('child_process');


export const servicesList = async (req: Request, res: Response) => {
    console.log("Services List")

    const { pageNo, pageSize = 5, isReal } = req.query;

    const skip = (Number(pageNo) - 1) * Number(pageSize);

    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken: any = await verifyToken(token);
            const userId: string = decodedToken?.uid;

            const services = isReal !== undefined ? await Services.find({ userId, isReal }).skip(skip)
                .limit(Number(pageSize)) : await Services.find({ userId }).skip(skip)
                    .limit(Number(pageSize))

            return res.status(200).json({
                total: isReal !== undefined ? (await Services.find({ userId, isReal })).length : (await Services.find({ userId })).length,
                pageSize,
                pageNo,
                success: true,
                message: 'Fetch Successfully',
                services
            })

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



};

export const addService = async (req: Request, res: Response) => {

    // const python = spawnSync('python',
    //     [__dirname + '/script.py'],
    //     { input: 'write this to stdin' });
    // if (python.status !== 0) {
    //     process.stderr.write(python.stderr);
    //     process.exit(python.status);
    // } else {
    //     process.stdout.write(python.stdout);
    //     process.stderr.write(python.stderr);
    // }
    // python

    const { userId } = req.body;
    try {
        const section = new Services({
            orignalFileName: req?.file?.originalname,
            fileName: req?.file?.filename,
            filePath: req?.file?.destination,
            userId: userId,
            isReal: true,
        })
        section.save()
        res.status(200).json(
            {
                success: true,
                message: 'Add Successfully',
                audio: section
            }
        );

    } catch (err) {
        res.status(500).send(err);
    }
};


export const FindOneService = async (req: Request, res: Response) => {
    const id = req.params['0']
    try {

        const service = await Services.findById(id)
        console.log(service)
        if (!service) {
            return res.status(404).json({
                success: false,
                message: `Can't Find audio`
            });
        } else {
            return res.status(202).json({
                success: true,
                message: `succesfully found`,
                audio: service
            });
        }

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

export const DeleteService = async (req: Request, res: Response) => {
    const id = req.params['0'];
    try {

        const service = await Services.findByIdAndDelete(id)
        console.log(service)
        if (!service) {
            return res.status(404).json({
                success: false,
                message: `Can't Deleted`
            });
        } else {
            return res.status(200).json({
                success: false,
                message: `Succesfully Deleted`
            });
        }

    } catch (error) {
        logger.error({
            level: 'debug',
            message: `${"Can't Find"} , ${error}`,
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(404).json({
            success: false,
            message: "Can't Find"
        });
    }
};



