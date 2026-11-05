source .env

export ISTEST=1

workingDir=$(pwd)
docker compose up &
databasePid=$!

cd $BACKEND_PATH
npm install
npx prisma generate
npx prisma db push --force-reset
npx prisma db seed
npm run dev &
backendPid=$!

cd $FRONTEND_PATH
npm install
npm run dev &
frontendPid=$!

sleep 1
cd $workingDir
BASE_URL=http://0.0.0.0:3001 npx playwright test --workers=1

kill $databasePid
kill $backendPid
kill $frontendPid
