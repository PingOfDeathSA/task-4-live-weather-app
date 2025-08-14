import { ThemeModel } from "../../model/thememodel";
import homecomstyle from "./home-com.module.css"


export default function HomeCom({ theme }: ThemeModel) {
    return (
        <div className={homecomstyle.homecom}>  <h1
        style={{ color: theme ? "white" : "#282c34fa" }}
        >Weather App</h1>
        <br />
          
      
        </div>
    );
}