import Navigation from "./Navigation";

function Layout(props) {
    return (
        <div>
            <Navigation/>
            {props.children}
        </div>
    )
}

export default Layout;