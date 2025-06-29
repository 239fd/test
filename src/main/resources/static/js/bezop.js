webix.ready(function () {
    webix.ui({
        rows: [
            {
                view: "template",
                type: "header",
                template: "Logger",
                gravity: "10"
            },
            {
                gravity: "90",
                cols: [
                    { gravity: "1" },
                    {
                        view: "tree",
                        id: "menuTree",
                        select: true,
                        gravity: "19",
                        data: [
                            { id: "logs", value: "Логи", data: [
                                    { id: "access", value: "Access" },
                                    { id: "error", value: "Error" },
                                    { id: "system", value: "System" }
                                ]}
                        ],
                        on: {
                            onItemClick: function (id) {
                                if (this.getItem(id).$count) return;
                                $$("logPanel").show();
                            }
                        }
                    },
                    {
                        gravity: "79",
                        rows: [
                            {
                                cols: [
                                    {
                                        view: "datepicker",
                                        id: "startDate",
                                        label: "С",
                                        value: new Date(),
                                        stringResult: true
                                    },
                                    {
                                        view: "datepicker",
                                        id: "endDate",
                                        label: "По",
                                        value: new Date(),
                                        stringResult: true
                                    },
                                    {
                                        view: "multiselect",
                                        id: "serverList",
                                        label: "Серверы",
                                        options: [],
                                        placeholder: "Выберите серверы"
                                    },
                                    {
                                        view: "button",
                                        value: "Загрузить логи",
                                        click: function () {
                                            const servers = $$("serverList").getValue();
                                            const from = $$("startDate").getValue();
                                            const to = $$("endDate").getValue();

                                            webix.ajax().get("http://localhost:8080/api/logs", {
                                                servers: servers,
                                                from: from.toISOString(),
                                                to: to.toISOString()
                                            }).then(function (res) {
                                                const data = res.json();
                                                $$("logTable").clearAll();
                                                $$("logTable").parse(data);
                                            });
                                        }
                                    }
                                ]
                            },
                            {
                                id: "logPanel",
                                gravity: "80",
                                view: "datatable",
                                id: "logTable",
                                columns: [
                                    { id: "timestamp", header: "Время", fillspace: 1 },
                                    { id: "server", header: "Сервер", fillspace: 1 },
                                    { id: "level", header: "Уровень", fillspace: 1 },
                                    { id: "message", header: "Сообщение", fillspace: 2 }
                                ],
                                autoheight: true,
                                autowidth: true,
                                select: "row"
                            },
                            {
                                view: "button",
                                value: "Выгрузить в Excel",
                                click: function () {
                                    webix.toExcel($$("logTable"), {
                                        filename: "Логи"
                                    });
                                }
                            }
                        ]
                    },
                    { gravity: "1" }
                ]
            }
        ]
    });

    // Подгружаем список серверов
    webix.ajax().get("http://localhost:8080/api/servers").then(function (res) {
        const servers = res.json(); // предполагается [{ id: "...", value: "..." }]
        $$("serverList").define("options", servers);
        $$("serverList").refresh();
    });

    // Прячем панель с логами до выбора
    $$("logPanel").hide();
});
