import { Request, Response } from 'express';
import logger from '../../logger';
import ContactUs from '../../models/contact-us';
import { v4 } from 'uuid'

export const ContactUsList = async (req: Request, res: Response) => {
    console.log("Blog List")
    try {
        const contact = await ContactUs.aggregate([
            {
                "$project": {
                    "_id": 1,
                    "firstName": 1,
                    "lastName": 1,
                    "massage": 1,
                    "phoneNo": 1,
                    "email": 1,
                    "visit": 1,
                    "createdAt": 1,
                    "updatedAt": 1
                }
            }
        ])
        return res.status(200).json({
            total: contact.length,
            contact
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
export const AddContactUs = async (req: Request, res: Response) => {
    const { firstName, lastName, massage, phoneNo, email } = req.body;
    console.log("Add Contact Us")
    console.log(firstName, lastName, massage, phoneNo, email)
    try {
        const created = new ContactUs({
            firstName: firstName,
            lastName: lastName,
            massage: massage,
            phoneNo: phoneNo,
            email: email
        })
        await created.save();
        return res.status(200).json({
            success: true,
            message: 'contact Added Successfully',
            created: created

        });

    } catch (error) {
        logger.error({
            level: 'debug',
            message: `${'Add Failure'} , ${error}`,
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
            success: false,
            message: 'Fail to Add'
        });
    }

};
export const FindOne = async (req: Request, res: Response) => {
    console.log(req.params['0'])
    const id = req.params['0']
    try {
        const contact = await ContactUs.findById(id)
        return res.status(200).json(
            contact
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

export const EditContactUs = async (req: Request, res: Response) => {
    const { id, firstName, lastName, massage, phoneNo, email, visit } = req.body;
    console.log("Edit BLog")

    try {
        if (id) {
            await ContactUs.findByIdAndUpdate(id, {
                firstName: firstName,
                lastName: lastName,
                massage: massage,
                phoneNo: phoneNo,
                email: email,
                visit: visit
            }, (err, result) => {
                if (err)
                    res.send(err)
            })
            return res.status(200).json({
                success: true,
                message: 'SuccessFully to Edit'
            });
        } else {
            return res.status(200).json({
                success: false,
                message: 'Id is Null to Edit'
            });
        }
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

export const DeleteContactUs = async (req: Request, res: Response) => {
    const id = req.params['0']
    try {
        const del = await ContactUs.deleteOne({ _id: id });
        console.log(del)
        return res.status(200).json(
            del
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