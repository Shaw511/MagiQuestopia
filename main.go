package main

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net"
	"net/http"
)

type User struct {
	Name  string
	Email string
}

type Todo struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
}

var todos []Todo

func printIP() {
	// 局域网IP获取
	fmt.Println("局域网IP获取如下：")
	// 获取所有网络接口的信息
	interfaces, err := net.Interfaces()
	if err != nil {
		fmt.Println("Failed to get network interfaces:", err)
		return
	}

	// 遍历网络接口
	for _, iface := range interfaces {
		// 排除回环接口和无效接口
		if iface.Flags&net.FlagLoopback == 0 && iface.Flags&net.FlagUp != 0 {
			// 获取接口的IP地址
			addrs, err := iface.Addrs()
			if err != nil {
				fmt.Println("Failed to get addresses:", err)
				continue
			}

			// 遍历IP地址
			for _, addr := range addrs {
				// 检查IP地址是否为IPNet类型，且为IPv4或IPv6地址
				if ipnet, ok := addr.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
					if ipnet.IP.To4() != nil {
						fmt.Println("IPv4 Address:", ipnet.IP)
					} else if ipnet.IP.To16() != nil {
						fmt.Println("IPv6 Address:", ipnet.IP)
					}
				}
			}
		}
	}
	//公网IP获取
	fmt.Println("公网IP获取如下:")
	// 向一个提供公网IP查询服务的网站发送GET请求
	resp, err := http.Get("https://api.ipify.org?format=text")
	if err != nil {
		fmt.Println("Failed to get public IP:", err)
		return
	}
	defer resp.Body.Close()

	// 读取响应的内容
	ip, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to read response:", err)
		return
	}

	fmt.Println("Public IP:", string(ip))
}

func myWeb(wr http.ResponseWriter, req *http.Request) {
	//fmt.Fprintf(wr, "服务器开启")
	// 解析模板文件
	templates, err := template.ParseFiles("templates/index.html")
	if err != nil {
		fmt.Println("Failed to parse template:", err)
		return
	}
	// 创建一个数据对象
	user := User{
		Name:  "John Doe",
		Email: "johndoe@example.com",
	}

	// 执行模板，并将生成的内容写入//
	err = templates.ExecuteTemplate(wr, "index.html", user)
	if err != nil {
		fmt.Println("Failed to execute template:", err)
		return
	}

}

func main() {
	//printIP()
	// 设置静态文件目录
	fs := http.FileServer(http.Dir("my-app/build"))

	// 设置路由，将所有请求转发到React前端
	http.Handle("/", fs)

	// 启动HTTP服务器
	log.Println("Server started on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))

}
