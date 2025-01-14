import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
} from "react-native";

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { getData, getItemWithSetter, storeData } from "@/utils/local_storage";
import PostForm from "@/components/PostForm";
import UpsertUser from "@/components/UpsertUser";
import { addNewPost, getAllPosts, toggleLike } from "@/utils/dummyPostData";
import { PostData } from "@/utils/postData";
import Post from "@/components/Post";
import Spacer from "@/components/Spacer";

export default function Index() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpsertUserModalOpen, setIsUpsertUserModalOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const getPostsFromLocal = async () => {
    const posts = await getData("posts");
    if (posts) {
      setPosts(JSON.parse(posts));
    }
  };

  useEffect(() => {
    getItemWithSetter("user", setUserName);
    getPostsFromLocal();
  }, []);

  return (
    <View style={styles.titleContainer}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              style={{ paddingRight: 6 }}
              onPress={() => setIsModalOpen(true)}
            >
              <Text>Nytt innlegg</Text>
            </Pressable>
          ),
          headerLeft: () => (
            <Pressable
              style={{ paddingLeft: 6 }}
              onPress={() => setIsUpsertUserModalOpen(true)}
            >
              <Text>{userName ? userName : "Profil"}</Text>
            </Pressable>
          ),
        }}
      />
      <Modal visible={isUpsertUserModalOpen} animationType="slide">
        <UpsertUser
          closeModal={() => setIsUpsertUserModalOpen(false)}
          createUserName={(name) => {
            setUserName(name);
            storeData("user", name);
            setIsUpsertUserModalOpen(false);
          }}
        />
      </Modal>
      <Modal visible={isModalOpen} animationType="slide">
        <PostForm
          addNewPost={(post) => {
            setPosts([post, ...posts]);
            storeData("posts", JSON.stringify([post, ...posts]));
            setIsModalOpen(false);
          }}
          closeModal={() => setIsModalOpen(false)}
        />
      </Modal>
      <FlatList
        style={{
          width: "100%",
          paddingHorizontal: 20,
        }}
        data={posts}
        ListHeaderComponent={() => <Spacer height={10} />}
        ListFooterComponent={() => <Spacer height={50} />}
        ItemSeparatorComponent={() => <Spacer height={8} />}
        renderItem={(post) => (
          <Post
            key={post.index}
            postData={post.item}
            toggleLike={(id) => {
              const tempPosts = posts.map((tempPost) => {
                if (tempPost.id === id) {
                  return { ...tempPost, isLiked: !tempPost.isLiked };
                }
                return tempPost;
              });

              setPosts(tempPosts);
              storeData("posts", JSON.stringify(tempPosts));
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  textFieldContainer: {
    width: "100%",
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 20,
  },
  textfield: {
    borderWidth: 1,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
