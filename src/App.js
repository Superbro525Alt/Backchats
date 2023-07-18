import {

    ClerkProvider,

    SignedIn,

    SignedOut,

    RedirectToSignIn,

    SignIn,

    SignUp,

    UserButton, useUser,

} from "@clerk/clerk-react";

import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

import { getDatabase, ref, set, push, onValue } from "firebase/database";
import {useEffect, useState} from "react";

// TODO: Add SDKs for Firebase products that you want to use

// -> firebase deploy --only hosting:backchats

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyCNe9lzi9me06VloAYV3U5Vz37w9TrSUvQ",

  authDomain: "webchatapp-c0505.firebaseapp.com",

  databaseURL: "https://webchatapp-c0505-default-rtdb.firebaseio.com",

  projectId: "webchatapp-c0505",

  storageBucket: "webchatapp-c0505.appspot.com",

  messagingSenderId: "526626514822",

  appId: "1:526626514822:web:78fccf1b23d97177422e07",

  measurementId: "G-BHZ586299T"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const database = getDatabase(app);


if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {

  throw new Error("Missing Publishable Key")

}


const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function open_app() {
    window.location.href = "app";
}



function insertParam(key, value) {
    var url_params = "";
    console.log("--------------------")

    for (var i = 0; i < key.length; i++) {
        url_params += '?&' + key[i] + '=' + value[i];
    }
    var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + url_params;
    window.history.pushState({ path: refresh }, '', refresh);

    LoadBody();

}

function friends() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page = urlParams.get('directMessageLocation');
    if (page) {
        insertParam(["location", "directMessageLocation"], ["friends", page]);
    }
    else {
        insertParam(["location", "directMessageLocation"], ["friends", "none"]);
    }

}

function servers() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page = urlParams.get('directMessageLocation');
    if (page) {
        insertParam(["location", "directMessageLocation"], ["servers", page]);
    }
    else {
        insertParam(["location", "directMessageLocation"], ["servers", "none"]);
    }
}

function home() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page = urlParams.get('directMessageLocation');
    if (page) {
        insertParam(["location", "directMessageLocation"], ["home", page]);
    }
    else {
        insertParam(["location", "directMessageLocation"], ["home", "none"]);
    }
}

function direct_messages() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page = urlParams.get('directMessageLocation');
    if (page) {
        insertParam(["location", "directMessageLocation"], ["direct_messages", page]);
    }
    else {
        insertParam(["location", "directMessageLocation"], ["direct_messages", "none"]);
    }
}

function PublicPage() {

  return (

    <>



      <button onClick={open_app}>Open</button>

    </>

  );

}

function Nav() {
    return (

        <>
            <ul className="horizontal">
                <li>
                    <a onClick={home}>Home</a>
                </li>
                <li style={{"float": "right"}} className="UserButton">

                    <UserButton/>
                </li>

                <li>
                    <a onClick={friends}>Friends</a>
                </li>

                <li>
                    <a onClick={servers}>Servers</a>
                </li>

                <li>
                    <a onClick={direct_messages}>Direct Messages</a>
                </li>
            </ul>

        </>

    );
}



function LoadBody() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page = urlParams.get('location');
    //console.log(page)
    switch (page) {
        case "friends?":
            document.getElementById("friends").style.display = "block";
                        document.getElementById("home").style.display = "none";
            document.getElementById("servers").style.display = "none";
            document.getElementById("direct_messages").style.display = "none";
            break

        case "servers?":
            document.getElementById("servers").style.display = "block";
            document.getElementById("home").style.display = "none";
            document.getElementById("friends").style.display = "none";
            document.getElementById("direct_messages").style.display = "none";
                console.log(page)
            break

        case "direct_messages?":
            document.getElementById("direct_messages").style.display = "block";
            document.getElementById("home").style.display = "none";
            document.getElementById("friends").style.display = "none";
            document.getElementById("servers").style.display = "none";
            break;

        default:
            // add divs for the different sections of the page
            document.getElementById("home").style.display = "block";
                        document.getElementById("servers").style.display = "none";
            document.getElementById("friends").style.display = "none";
            document.getElementById("direct_messages").style.display = "none";
                console.log(page)
            break


    }

}

function MenuButton(props) {

    return (
        <>
            <button onClick={props.onClick} className="menu_button">{props.name}</button>
        </>
    );
}

function MenuButtonRound(props) {

    return (
        <>
            <button onClick={props.onClick} className="menu_button_round">{props.name}</button>
        </>
    );
}

function Notification(props) {
    return (
        <>
            <div className="holder">
                <div className="notification_holder">
                    <div id="notification_image_holder" className="notification_image_holder">
                        <img className="notification_image" src={props.image} alt="icon"/>
                        <p className="notification_title">{props.name}</p>
                    </div>
                    <div className="notification_text_holder">
                        <p className="notification_title">{props.channel}</p>
                        <p className="notification_message">{props.message}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

function Friend(props) {
    return (
        <>
            <div className="holder">
                <div className="notification_holder">
                    <div id="notification_image_holder" className="notification_image_holder">
                        <img className="notification_image" src={props.image} alt="profile"/>
                        <p className="notification_title">{props.name}</p>
                    </div>
                    <div className="notification_text_holder">
                        <p className="notification_message">{props.status}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

function Server(props) {
    return (
        <>
            <div className="holder">
                <div className="notification_holder">
                    <div id="notification_image_holder" className="notification_image_holder">
                        <img className="notification_image" src={props.image} alt="profile"/>
                        <p className="notification_title">{props.name}</p>
                    </div>
                    <div className="notification_text_holder">
                        <p className="notification_message">{props.desc}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

function Inbox() {
    return (
        <>
            <Notification image="https://yt3.ggpht.com/ytc/AOPolaQEUuM48zTRh_cHp0YlffijlEV9xq2Fm50KsEPnIw=s48-c-k-c0x00ffffff-no-rj" channel="#Test" name="Test Notification" message="Test"/>
        </>
    )
}

function resetTheme() {
    localStorage.setItem("theme", "default");
    window.location.reload();
}

function uploadCSS() {
    var file = document.getElementById("theme_upload_field").files[0];

    var reader = new FileReader();
    reader.onload = function(e) {
        localStorage.setItem("theme", reader.result);
        window.location.reload();
    }
    reader.readAsText(file);
}

function onPageLoad() {
    loadTheme();
}

function loadTheme() {
    var theme = localStorage.getItem("theme");
    if (theme != "default" && theme != null) {
        // load theme
        document.getElementsByTagName("style")[1].innerHTML = theme;
    }

}

function Settings() {
    return (
        <>
            <div className="settings_holder">
                <div className="settings_section_holder">
                    <p className="settings_section_title">User Profile</p>
                </div>
                <div className="settings_section_holder">
                    <p className="settings_section_title">Appearance</p>

                    <p className="settings_section_text_header">Theme</p>

                    <p className="settings_section_text">Upload Theme</p>

                    <div className="file-upload-wrapper" data-text="Select your file!">
                        <input name="file-upload-field" type="file" className="file-upload-field" id="theme_upload_field"  value="" accept=".css" onChange={uploadCSS}/>
                    </div>

                    <MenuButtonRound name="Reset Theme" onClick={resetTheme}/>



                </div>
                <div className="settings_section_holder">
                    <p className="settings_section_title">Privacy & Safety</p>
                </div>
            </div>
        </>
    )
}

function InboxSort() {
    return (
        <>
            <div className="inbox_sort_holder">
                <p className="inbox_sort_text">Sort By:</p>
                <select className="inbox_sort">
                    <option value="Title (A-Z)">Title (A-Z)</option>
                    <option value="Message (A-Z)">Message (A-Z)</option>
                    <option value="Sender Name (A-Z)">Sender Name (A-Z)</option>
                </select>
            </div>
        </>
    )
}

function InboxFilter() {
    return (
        <>
            <div className="inbox_filter_holder">
                <p className="inbox_filter_text">Filter By:</p>
                <select className="inbox_filter">
                    <option value="All">All</option>
                    <option value="Servers">Servers</option>
                    <option value="Users">Users</option>
                    <option value="Friends">Friends</option>
                    <option value="Not Friends">Not Friends</option>
                </select>
            </div>
        </>
    )
}

function FriendsSort() {
    return (
        <>
            <div className="inbox_sort_holder">
                <p className="inbox_sort_text">Sort By:</p>
                <select className="inbox_sort">
                    <option value="Sender Name (A-Z)">Name (A-Z)</option>
                </select>
            </div>
        </>
    )
}

function FriendsFilter() {
    return (
        <>
            <div className="inbox_filter_holder">
                <p className="inbox_filter_text">Filter By:</p>
                <select className="inbox_filter">
                    <option value="All">All</option>
                </select>
            </div>
        </>
    )
}

function ServerSort() {
    return (
        <>
            <div className="inbox_sort_holder">
                <p className="inbox_sort_text">Sort By:</p>
                <select className="inbox_sort">
                    <option value="Sender Name (A-Z)">Server Name (A-Z)</option>
                </select>
            </div>
        </>
    )
}

function ServerFilter() {
    return (
        <>
            <div className="inbox_filter_holder">
                <p className="inbox_filter_text">Filter By:</p>
                <select className="inbox_filter">
                    <option value="All">All</option>
                </select>
            </div>
        </>
    )
}

function loadInbox() {
    document.getElementById("inbox").style.display = "block";
    document.getElementById("inbox_menu_holder").style.display = "block";
    document.getElementById("settings").style.display = "none";
    document.getElementById("settings_menu_holder").style.display = "none";
}

function loadSettings() {
    document.getElementById("inbox").style.display = "none";
    document.getElementById("settings").style.display = "block";
    document.getElementById("settings_menu_holder").style.display = "block";
    document.getElementById("inbox_menu_holder").style.display = "none";
}

function SettingsButtons() {
    return (
        <>
            <MenuButton name="User Profile"/>
            <MenuButton name="Appearance"/>
            <MenuButton name="Privacy & Safety"/>
        </>
    )
}

function Home() {

    return (
        <>
            <div id="wrapper" className="wrapper">
                <div id="flex-container" className="flex-container">
                    <div id="left-sidebar" className="leftsidebar">
                        <MenuButton name="Inbox" onClick={loadInbox}/>
                        <MenuButton name="Settings" onClick={loadSettings}/>
                    </div>
                    <div id="main" className="main">
                        <div id="inbox">
                            <Inbox/>
                        </div>
                        <div id="settings" style={{"display": "none"}}>
                            <Settings/>
                        </div>
                    </div>
                    <div id="right-sidebar" className="rightsidebar">
                        <div id="inbox_menu_holder">
                            <InboxSort/>
                            <InboxFilter/>
                        </div>
                        <div id="settings_menu_holder" style={{"display": "none"}}>
                            <SettingsButtons/>
                        </div>
                    </div>

                </div>
                <div id="bottom" className="bottom">
                </div>
            </div>

        </>

    )

}

function FriendButton(props) {
        return (
        <>
            <div className="friend_button_holder">
                <div className="friend_button_holder">
                    <img className="friend_button_image" src={props.image} alt=""/>
                </div>
                <p className="friend_button_text">{props.name}</p>
            </div>

        </>
    )
}



function DirectMessages(props) {

    const [pageData, setPageData] = useState([]);
    const [canRender, setCanRender] = useState(true);


    useEffect(() => {

        if (canRender) {
            setCanRender(false);
            var queryString = window.location.search;
            var urlParams = new URLSearchParams(queryString);
            var page = urlParams.get('directMessageLocation');


            var new_data = [];


            onValue(ref(database, "users/" + localStorage.getItem("userId") + "/direct_messages"), (snapshot) => {
                var dms = snapshot.val();
                for (var i = 1; i < dms.length; i++) {
                    onValue(ref(database, "users/" + dms[i]), (snapshot) => {
                        var dm = snapshot.val();


                        var metadata = JSON.parse(dm.metadata);

                        if (metadata.username == null) {
                            var name = metadata.firstName;
                        } else {
                            var name = metadata.username;
                        }

                        var image = metadata.imageUrl;


                        console.log(image);

                        //Friend_elements.push(<Friend name={name} image={image} status={"test"} key={metadata.id}/>);
                        new_data.push({"name": name, "image": image, "key": metadata.id});


                    });
                }
            });



            setPageData(new_data);



            setTimeout(() => {
                setCanRender(true);

            }, 1000);
        }

    }, []);


    return (
        <>
            <div id="wrapper" className="wrapper">
                <div id="flex-container" className="flex-container">
                    <div id="left-sidebar" className="leftsidebar">
                        {pageData.map((data) => (<FriendButton name={data.name} image={data.image} key={data.key}/>))}
                    </div>
                    <div id="main" className="main_normal">

                    </div>
                    <div id="right-sidebar" className="rightsidebar">

                    </div>

                </div>
                <div id="bottom" className="bottom">
                </div>
            </div>
            </>
    )
}



function Friends() {
    const [__friends, setFriends] = useState([]);
    const [canRender, setCanRender] = useState(true);

    useEffect(() => {
        var friendsData = [];
        if (canRender) {
            onValue(ref(database, `users/${localStorage.getItem("userId")}`), (snapshot) => {
                var _friends = snapshot.val().friends;
                for (var i = 1; i < _friends.length; i++) {
                    onValue(ref(database, `users/${_friends[i]}`), (snapshot) => {
                        var friend = snapshot.val();
                        var metadata = JSON.parse(friend.metadata);
                        console.log(metadata);
                        if (metadata.username == null) {
                            var name = metadata.firstName;
                        } else {
                            var name = metadata.username;
                        }

                        var image = metadata.imageUrl;

                        var status = friend.status;

                        console.log(image);

                        //Friend_elements.push(<Friend name={name} image={image} status={"test"} key={metadata.id}/>);
                        friendsData.push({"name": name, "image": image, "status": status, "key": metadata.id});

                    });
                }
                setFriends(friendsData);
            })

            setCanRender(false);
            setTimeout(() => {
                setCanRender(true);
            }, 2500);
        }
    })

    return (
        <>
            <div id="wrapper" className="wrapper">
                <div id="flex-container" className="flex-container">

                    <div id="main" className="main">
                        {__friends.map((___friend) => (<Friend name={___friend.name} image={___friend.image} status={___friend.status} key={___friend.key}/>))}
                    </div>
                    <div id="right-sidebar" className="rightsidebar">
                        <div id="inbox_menu_holder">
                            <FriendsSort/>
                            <FriendsFilter/>
                        </div>
                    </div>

                </div>
                <div id="bottom" className="bottom">
                </div>
            </div>

        </>

    )
}

function Servers() {
    const [__servers, setServers] = useState([]);
    const [canRender, setCanRender] = useState(true);

    useEffect(() => {
        var serversData = [];
        if (canRender) {
            onValue(ref(database, `users/${localStorage.getItem("userId")}`), (snapshot) => {
                var _servers = snapshot.val().servers;
                for (var i = 1; i < _servers.length; i++) {
                    onValue(ref(database, `servers/${_servers[i]}`), (snapshot) => {
                        var server = snapshot.val();
                        var name = server.name;
                        var image = server.image;
                        var desc = server.desc;


                        //Friend_elements.push(<Friend name={name} image={image} status={"test"} key={metadata.id}/>);
                        serversData.push({"name": name, "image": image, "desc": desc});

                    });
                }
                setServers(serversData);
            })

            setCanRender(false);
            setTimeout(() => {
                setCanRender(true);
            }, 2500);
        }
    })
    return (
        <>
            <div id="wrapper" className="wrapper">
                <div id="flex-container" className="flex-container">

                    <div id="main" className="main">
                        {__servers.map((___server) => (<Server name={___server.name} key={___server.name} image={___server.image} desc={___server.desc}/>))}
                    </div>
                    <div id="right-sidebar" className="rightsidebar">
                        <div id="inbox_menu_holder">
                            <ServerSort/>
                            <ServerFilter/>
                        </div>
                    </div>

                </div>
                <div id="bottom" className="bottom">
                </div>
            </div>

        </>

    )
}

var createdUser = false;
function AppPage() {
    // get the signed in users id through clerk
    const {isSignedIn, user} = useUser();
    const userId = user?.id;

    localStorage.setItem("userId", userId);

    if (!createdUser) {
        onValue(ref(database, "users/"), (snapshot) => {
            var data = snapshot.val();
            console.log(data);
            if (data[userId] == null) {
                if (createdUser) return;
                createdUser = true;
                set(ref(database, `users/${userId}`), {
                    "metadata": JSON.stringify(user),
                    "servers": [""],
                    "friends": [""],
                    "status": "online"
                }).then(r => {

                })
            }
        });
    }

    setTimeout(LoadBody, 10);
    setTimeout(onPageLoad, 10);
    return (

        <>
            <Nav/>
            <div id="home" style={{"display": "none", "height": "93.9%"}}>
                <Home/>
            </div>
            <div id="servers" style={{"display": "none", "height": "93.9%"}}>
                <Servers/>
            </div>
            <div id="friends" style={{"display": "none", "height": "93.9%"}}>
                <Friends/>
            </div>
            <div id="direct_messages" style={{"display": "none", "height": "93.9%"}}>
                <DirectMessages/>
            </div>


        </>

    );


}




function ClerkProviderWithRoutes() {

  const navigate = useNavigate();


  return (

    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>

      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/sign-in/*" element={<div className="wrapper"> <div className="background"></div> <div className="content"> <SignIn routing="path" path="/sign-in" /></div></div>}/>

          <Route path="/sign-up/*" element={ <div className="wrapper"> <div className="background"></div> <div className="content"> <SignUp routing="path" path="/sign-up" /> </div></div>}/>

        <Route path="/app" element={<>
          <SignedIn>
              <AppPage />
            </SignedIn>
             <SignedOut>
              <RedirectToSignIn />
           </SignedOut>
          </>
          }

        />



      </Routes>

    </ClerkProvider>

  );

}


function App() {



    // on the url params change

  return (

    <BrowserRouter>

      <ClerkProviderWithRoutes />

    </BrowserRouter>

  );

}


export default App;
