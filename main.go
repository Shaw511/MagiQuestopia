package main

import (
	"encoding/json"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os/exec"
)

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Username string `gorm:"unique"`
	Password string
}

type Todo struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
}

var todos []Todo
var db *gorm.DB

func setupDB() (*gorm.DB, error) {
	// 创建数据库连接 有误
	dsn := "root:qqdxgw2438@tcp(43.153.206.198:3306)/DB001?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// 进行数据库迁移
	err = db.AutoMigrate(&User{})
	if err != nil {
		return nil, err
	}

	return db, nil
}

func handleRegister(w http.ResponseWriter, r *http.Request) {
	//解析请求体中的JSON数据
	var requestBody struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		//处理错误
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	//将账号的密码存储到数据库中
	// 创建用户对象
	user := User{
		Username: requestBody.Username,
		Password: requestBody.Password,
	}

	// 插入数据到数据库中
	result := db.Create(&user)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	//返回响应给前端
	response := struct {
		Success bool `json:"success"`
	}{
		Success: true,
	}
	json.NewEncoder(w).Encode(response)
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	//解析请求体中的JSON数据
	var requestBody struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		//处理错误
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	//在数据库中查询账号密码信息，如果输入的用户名和密码对应，则继续登录，否则返回错误
	var user User
	result := db.Where("username = ?", requestBody.Username).First(&user)
	if result.Error != nil {
		// 用户不存在
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// 验证密码是否匹配
	if user.Password != requestBody.Password {
		// 密码错误
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	//返回响应给前端
	response := struct {
		Success bool `json:"success"`
	}{
		Success: true,
	}
	json.NewEncoder(w).Encode(response)
}

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

//func homeHandler(w http.ResponseWriter, r *http.Request) {
//	fmt.Fprintf(w, "Hello, World!")
//}

func runCommand(w http.ResponseWriter, r *http.Request) {
	command := r.URL.Query().Get("command")
	dataset := r.URL.Query().Get("dataset")
	numPerturbSamples := r.URL.Query().Get("numPerturbSamples")
	topNode := r.URL.Query().Get("topNode")

	cmd := exec.Command(command, "--dataset", dataset, "--num-perturb-samples", numPerturbSamples, "--top-node", topNode)
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Println(err)
		fmt.Fprintf(w, "Error occurred while running the command.")
		return
	}

	fmt.Fprintf(w, string(output))
}

func main() {
	//// 初始化数据库连接 先不管它
	//db, err := setupDB()
	//if err != nil {
	//	log.Fatal(err)
	//}
	//defer func() {
	//	dbInstance, _ := db.DB()
	//	_ = dbInstance.Close()
	//}()
	//printIP()

	// 注册路由处理函数
	http.HandleFunc("/api/register", handleRegister)
	http.HandleFunc("/api/login", handleLogin)

	//2月22号测试后端
	http.HandleFunc("/api/run-command", runCommand)

	// 配置静态文件路由
	staticDir := "my-app/build" // 替换成您的前端构建版本的路径
	fs := http.FileServer(http.Dir(staticDir))
	http.Handle("/", fs)

	// 启动服务器，监听端口
	port := ":8000"
	fmt.Printf("Server listening on port%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))

}
