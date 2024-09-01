import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function TicketSkeleton() {
  return (
    <div className='relative h-[34rem] flex justify-center items-center'>
      <div className='-z-10 bg-opacity-10 bg-black dark:bg-opacity-100 w-full h-full fixed top-0'>
        <Skeleton height="100%" width="100%" />
      </div>
      <div className="text-black overflow-hidden w-3/4 max-w-2xl mx-auto p-10 mb-16 relative">
        <Skeleton className='absolute -z-10 -left-0' height={300} />
        <div className='h-56 left-2/4 absolute w-0 border border-t-2 border-dashed' style={{ borderColor: "#2B4248" }}></div>
        <div className="relative top-5 text-white">
          <div className='flex justify-between px-3 p-1.5 items-center' style={{ backgroundColor: "#2B4248" }}>
            <Skeleton width={100} height={20} />
            <Skeleton width={150} height={20} />
          </div>
          <div className="rounded-lg p-1 flex justify-between relative overflow-hidden" style={{ color: "#2B4248" }}>
            <div className='flex justify-start gap-3'>
              <div className="w-full">
                <Skeleton width={150} height={30} />
                <div className='text-xs font-semibold'>
                  <Skeleton width={200} height={20} />
                  <Skeleton width={150} height={20} />
                  <Skeleton width={100} height={20} />
                </div>
                <div className="mt-2">
                  <Skeleton width={160} height={40} />
                </div>
              </div>
              <div className="w-1/2 font-bold flex flex-col justify-between">
                <div className='text-xs'>
                  <Skeleton width={150} height={20} />
                  <Skeleton width={150} height={20} />
                  <Skeleton width={150} height={20} />
                </div>
                <div className="flex gap-4 items-center">
                  <Skeleton width={100} height={20} />
                  <Skeleton width={60} height={60} circle={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketSkeleton;
