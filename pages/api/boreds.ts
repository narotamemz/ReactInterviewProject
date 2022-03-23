import prisma from '../../lib/prisma';

export default async (req: any, res: any) => {
  try {
    const data = await prisma.boreds.findMany({
      skip: req.query._start ? parseInt(req.query._start) : 0,
      take: req.query._limit ? parseInt(req.query._limit) : 1,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
