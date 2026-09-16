import { PrismaClient } from '@prisma/client';
import { SEED_FARMS, SEED_FARMERS, SEED_INSURANCE_UNITS } from '../src/lib/db/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AgriSure Intelligence PostgreSQL + PostGIS database...');

  // 1. Create Insurance Units
  for (const iu of SEED_INSURANCE_UNITS) {
    await prisma.insuranceUnit.upsert({
      where: { code: iu.code },
      update: {},
      create: {
        id: iu.id,
        code: iu.code,
        name: iu.name,
        district: iu.district,
        gramPanchayat: iu.gramPanchayat,
        crop: iu.crop,
        totalAreaHa: iu.totalAreaHa,
        chfBaseline: iu.chfBaseline,
        currentChf: iu.currentChf,
        riskState: iu.riskState,
        boundaryGeoJson: iu.boundaryCoordinates,
      },
    });
  }

  // 2. Create Farmers & Users
  for (const f of SEED_FARMERS) {
    const user = await prisma.user.upsert({
      where: { email: f.email },
      update: {},
      create: {
        email: f.email,
        name: f.name,
        phone: f.phone,
        role: 'FARMER',
      },
    });

    await prisma.farmer.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        id: f.id,
        userId: user.id,
        bankAccountMask: f.bankAccountMask,
        ifscCode: f.ifscCode,
        district: f.district,
        gramPanchayat: f.gramPanchayat,
      },
    });
  }

  console.log(`Successfully seeded ${SEED_INSURANCE_UNITS.length} Insurance Units, ${SEED_FARMERS.length} Farmers, and ${SEED_FARMS.length} Farms.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
