import prisma from '../../lib/prisma';

export default async (req: any, res: any) => {
  const insertData = await prisma.boreds.create({
    data: req.body,
  });
  res.status(200).json(insertData);
};
