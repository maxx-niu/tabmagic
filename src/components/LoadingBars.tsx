import { FC } from 'react'
import '../styles/LoadingBars.css'

type LoadingBarsProps = {
  animationDuration?: number;
}

const LoadingBars: FC<LoadingBarsProps> = ({animationDuration = 0.4}) => {
  // const [showLoading, setmShowLoading] = useState<Boolean>(false);
  return (
    <>
      <div className="loading-bar-container">
        <div 
          className="loading-bar-1"
          style={{ animationDuration: `${animationDuration}s` }}
        ></div>
        <div 
          className="loading-bar-2"
          style={{ animationDuration: `${animationDuration}s` }}
        ></div>
        <div 
          className="loading-bar-3"
          style={{ animationDuration: `${animationDuration}s` }}
        ></div>
      </div>
    </>
  )
}

export default LoadingBars;