import React, { useState, useEffect } from 'react';
import SidebarTags from './SidebarTags';
import Notifications from './Notifications';
import '../assets/UserProfile.css';

const UserDB = require('../modules/UserDB');

function UserProfile() {
  const [showNotifs, setShowNotifs] = useState(false);
  /** used for showing interest in side bar */
  // const [tags, setTags] = useState([]);
  /** list of posts and whish list that will show on profile page */
  const [posts, setPosts] = useState([]);
  const [whishList, setWishList] = useState([]);

  const myStorage = window.sessionStorage;
  const PostTableGenerator = (postsOrWishList) => {
    const table = postsOrWishList.map((post) => (
      <tr>
        <td>
          <div className="post-title">
            Post [
            {post.id}
            ]: [
            {post.itemName}
            ] - [
            {post.status}
            ]
          </div>
          <div className="post-content">
            This post is led by [
            {post.ownerName}
            ] and trades [
            {post.itemNumTarget}
            ] of [
            {post.itemNumCurrent}
            ] for
            $[
            {post.pricePerItem}
            ]
            <br />
            <br />
            [
            {post.tags}
            ]
          </div>
        </td>
      </tr>
    ));
    return table;
  };

  useEffect(() => {
    const userID = myStorage.getItem('UserID');
    UserDB.getUserDetails(userID, (success, userInfo, err) => {
      if (success) {
        // setTags(userInfo.interests);
        setPosts(userInfo.posts);
        setWishList(userInfo.wishList);
      } else {
        console.log(err);
      }
    });
  }, []);

  return (
    <div className="user-profile-page">
      <SidebarTags />
      <div>
        <div className="profile-title"><h1>My Profile</h1></div>
        <div className="bell-pos">
          <button className="bell-button" type="button" onClick={() => setShowNotifs(!showNotifs)}>
            {' '}
            <i className="fas fa-bell fa-2x" />
          </button>
        </div>
        <div className="notifications-pos">{showNotifs ? <Notifications showNotifs={showNotifs} setShowNotifs={setShowNotifs} /> : ''}</div>
        <div>
          <table>
            <tr>
              <td>
                <table>
                  <thead>
                    <tr>
                      <td>My Active Posts</td>
                    </tr>
                  </thead>
                  <tbody>
                    { PostTableGenerator(posts)}
                  </tbody>
                </table>
              </td>
              <td>
                <table>
                  <thead>
                    <tr>
                      <td>My Wishlist</td>
                    </tr>
                  </thead>
                  <tbody>
                    {PostTableGenerator(whishList)}
                  </tbody>
                </table>
              </td>
            </tr>
          </table>

        </div>

      </div>
    </div>
  );
}

export default UserProfile;
