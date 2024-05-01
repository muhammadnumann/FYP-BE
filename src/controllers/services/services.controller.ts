import { Request, Response } from 'express';
import logger from '../../logger';
import Services from '../../models/services';
const { spawnSync } = require('child_process');

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

export const userServicesList = async (req: Request, res: Response) => {
    const { id } = req.body
    console.log("user Services List")
    try {
        const services = await Services.find({ userId: id })
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

export const addService = async (req: Request, res: Response) => {

    const python = spawnSync('python',
        [__dirname + '/script.py'],
        { input: 'write this to stdin' });
    if (python.status !== 0) {
        process.stderr.write(python.stderr);
        process.exit(python.status);
    } else {
        process.stdout.write(python.stdout);
        process.stderr.write(python.stderr);
    }


    python
    const { userId } = req.body;
    try {

        const section = new Services({
            orignalFileName: req?.file?.originalname,
            fileName: req?.file?.filename,
            filePath: req?.file?.destination,
            // filePath: req?.file?.path: ,
            userId: userId,
        });



        res.status(404).json(req.file);

    } catch (err) {
        res.status(500).send(err);
    }
};


export const FindOneService = async (req: Request, res: Response) => {
    const id = req.params['0']
    try {

        const service = Services.findById(id)
        if (!service) {
            return res.status(404).json({
                success: false,
                message: `Can't Find`
            });
        } else {
            return res.status(202).json({
                success: true,
                message: `succesfully found`,
                data: service
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

        const service = Services.findByIdAndDelete(id)
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
            message: `${'Cant Find'} , ${error}`,
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(404).json({
            success: false,
            message: 'Cant Find'
        });
    }
};



